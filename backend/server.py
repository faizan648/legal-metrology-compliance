"""Legal Metrology Compliance Engine — FastAPI server."""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import io
import uuid
import base64
import logging
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from db import get_database
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, require_admin,
)
from compliance import extract_declarations_from_image, validate_declarations
from reports import build_pdf_report, build_docx_report


# ----------------------------- Setup -----------------------------
client, db = get_database()

app = FastAPI(title="Legal Metrology Compliance Engine")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("lm-compliance")


# ----------------------------- Models -----------------------------
class RegisterInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str
    role: Optional[str] = "officer"


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class ScanInput(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/jpeg"
    product_hint: Optional[str] = None
    notes: Optional[str] = None
    api_key: Optional[str] = None



class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str
    created_at: str


# ----------------------------- Helpers -----------------------------
async def _user_dep(request: Request) -> dict:
    return await get_current_user(request, db)


def _cookie_kwargs():
    return {
        "httponly": True,
        "secure": True,
        "samesite": "none",
        "path": "/",
    }


def _set_auth_cookie(response: Response, token: str):
    response.set_cookie(key="access_token", value=token, max_age=60 * 60 * 12, **_cookie_kwargs())


async def _serialize_user(u: dict) -> dict:
    return {
        "id": u["id"],
        "email": u["email"],
        "name": u["name"],
        "role": u["role"],
        "created_at": u["created_at"],
    }


# ----------------------------- Auth Endpoints -----------------------------
@api.post("/auth/register")
async def register(payload: RegisterInput, response: Response):
    email = payload.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": payload.name.strip(),
        "role": "officer",
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user)
    token = create_access_token(user["id"], email, user["role"])
    _set_auth_cookie(response, token)
    return {"user": await _serialize_user(user), "token": token}


@api.post("/auth/login")
async def login(payload: LoginInput, response: Response):
    email = payload.email.lower().strip()
    u = await db.users.find_one({"email": email})
    if not u or not verify_password(payload.password, u.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(u["id"], email, u["role"])
    _set_auth_cookie(response, token)
    return {"user": await _serialize_user(u), "token": token}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(_user_dep)):
    return await _serialize_user(user)


# ----------------------------- Scan / Compliance Endpoints -----------------------------
@api.post("/scans")
async def create_scan(payload: ScanInput, user: dict = Depends(_user_dep)):
    """Analyze a product image and produce a compliance report."""
    try:
        b64 = payload.image_base64.split(",", 1)[-1] if payload.image_base64.startswith("data:") else payload.image_base64
        extracted = await extract_declarations_from_image(b64, payload.mime_type or "image/jpeg", api_key=payload.api_key)
    except Exception as e:
        logger.exception("OCR extraction failed")
        raise HTTPException(status_code=502, detail=f"Image analysis failed: {e}")

    compliance = validate_declarations(extracted)
    scan = {
        "id": str(uuid.uuid4()),
        "scanned_by": user["id"],
        "scanned_by_email": user["email"],
        "scanned_by_name": user.get("name", ""),
        "product_hint": payload.product_hint,
        "notes": payload.notes,
        "mime_type": payload.mime_type,
        "image_base64": b64,
        "extracted": extracted,
        "compliance": compliance,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.scans.insert_one(scan)
    scan.pop("_id", None)
    return scan


@api.get("/scans")
async def list_scans(
    q: Optional[str] = None,
    verdict: Optional[str] = None,
    user: dict = Depends(_user_dep),
):
    query = {}
    if user["role"] != "admin":
        query["scanned_by"] = user["id"]
    if verdict:
        query["compliance.verdict"] = verdict
    if q:
        query["$or"] = [
            {"extracted.product_name": {"$regex": q, "$options": "i"}},
            {"extracted.manufacturer_name": {"$regex": q, "$options": "i"}},
            {"product_hint": {"$regex": q, "$options": "i"}},
        ]
    cursor = db.scans.find(query, {"_id": 0, "image_base64": 0}).sort("created_at", -1).limit(200)
    return await cursor.to_list(200)


@api.get("/scans/{scan_id}")
async def get_scan(scan_id: str, user: dict = Depends(_user_dep)):
    scan = await db.scans.find_one({"id": scan_id}, {"_id": 0})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    if user["role"] != "admin" and scan["scanned_by"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return scan


@api.delete("/scans/{scan_id}")
async def delete_scan(scan_id: str, user: dict = Depends(_user_dep)):
    scan = await db.scans.find_one({"id": scan_id})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    if user["role"] != "admin" and scan["scanned_by"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    await db.scans.delete_one({"id": scan_id})
    return {"ok": True}


@api.get("/scans/{scan_id}/report.pdf")
async def download_pdf(scan_id: str, user: dict = Depends(_user_dep)):
    scan = await db.scans.find_one({"id": scan_id}, {"_id": 0})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    if user["role"] != "admin" and scan["scanned_by"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    pdf_bytes = build_pdf_report(scan)
    fname = f"compliance-report-{scan_id[:8]}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{fname}"'},
    )


@api.get("/scans/{scan_id}/report.docx")
async def download_docx(scan_id: str, user: dict = Depends(_user_dep)):
    scan = await db.scans.find_one({"id": scan_id}, {"_id": 0})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    if user["role"] != "admin" and scan["scanned_by"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    docx_bytes = build_docx_report(scan)
    fname = f"compliance-report-{scan_id[:8]}.docx"
    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{fname}"'},
    )


# ----------------------------- Analytics -----------------------------
@api.get("/analytics/overview")
async def analytics_overview(user: dict = Depends(_user_dep)):
    match = {} if user["role"] == "admin" else {"scanned_by": user["id"]}
    total = await db.scans.count_documents(match)
    compliant = await db.scans.count_documents({**match, "compliance.verdict": "COMPLIANT"})
    partial = await db.scans.count_documents({**match, "compliance.verdict": "PARTIALLY_COMPLIANT"})
    non_compliant = await db.scans.count_documents({**match, "compliance.verdict": "NON_COMPLIANT"})

    pipeline = [
        {"$match": {**match, "compliance.verdict": "NON_COMPLIANT"}},
        {"$group": {"_id": "$extracted.manufacturer_name", "count": {"$sum": 1}}},
        {"$match": {"_id": {"$nin": [None, "", "null"]}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ]
    top_violators = [{"manufacturer": r["_id"], "count": r["count"]} async for r in await db.scans.aggregate(pipeline)]

    rule_pipeline = [
        {"$match": match},
        {"$unwind": "$compliance.checks"},
        {"$match": {"compliance.checks.status": {"$in": ["fail", "warning"]}}},
        {"$group": {"_id": "$compliance.checks.label", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    rule_violations = [{"rule": r["_id"], "count": r["count"]} async for r in await db.scans.aggregate(rule_pipeline)]

    trend_pipeline = [
        {"$match": match},
        {"$group": {
            "_id": {"$substr": ["$created_at", 0, 10]},
            "total": {"$sum": 1},
            "compliant": {"$sum": {"$cond": [{"$eq": ["$compliance.verdict", "COMPLIANT"]}, 1, 0]}},
        }},
        {"$sort": {"_id": -1}},
        {"$limit": 14},
    ]
    trend = [{"date": r["_id"], "total": r["total"], "compliant": r["compliant"]} async for r in await db.scans.aggregate(trend_pipeline)]
    trend.reverse()

    return {
        "total": total,
        "compliant": compliant,
        "partial": partial,
        "non_compliant": non_compliant,
        "compliance_rate": round((compliant / total) * 100, 1) if total else 0,
        "top_violators": top_violators,
        "rule_violations": rule_violations,
        "trend": trend,
    }


@api.get("/users")
async def list_users(user: dict = Depends(_user_dep)):
    require_admin(user)
    cursor = db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1)
    return await cursor.to_list(500)


# ----------------------------- Health -----------------------------
@api.get("/")
async def root():
    return {"service": "legal-metrology-compliance-engine", "status": "ok"}


# ----------------------------- Startup -----------------------------
async def _seed_users():
    for email_key, pwd_key, name, role in [
        ("ADMIN_EMAIL", "ADMIN_PASSWORD", "Metrology Admin", "admin"),
        ("OFFICER_EMAIL", "OFFICER_PASSWORD", "Field Officer", "officer"),
    ]:
        email = os.environ.get(email_key)
        pwd = os.environ.get(pwd_key)
        if not email or not pwd:
            continue
        email = email.lower().strip()
        existing = await db.users.find_one({"email": email})
        if existing is None:
            await db.users.insert_one({
                "id": str(uuid.uuid4()),
                "email": email,
                "name": name,
                "role": role,
                "password_hash": hash_password(pwd),
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info("Seeded %s user: %s", role, email)
        elif not verify_password(pwd, existing.get("password_hash", "")):
            await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(pwd), "role": role}})


@app.on_event("startup")
async def startup():
    try:
        if client is not None:
            await db.users.create_index("email", unique=True)
            await db.scans.create_index("scanned_by")
            await db.scans.create_index("created_at")
    except Exception as idx_err:
        logger.warning("Index creation skipped or non-supported on DB: %s", idx_err)
    
    try:
        await _seed_users()
    except Exception as seed_err:
        logger.warning("Seed users initialization error: %s", seed_err)

    logger.info("Server startup complete")


@app.on_event("shutdown")
async def shutdown():
    if client:
        client.close()


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
