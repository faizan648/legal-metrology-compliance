import os
import json
import uuid
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any

logger = logging.getLogger("lm-compliance-db")

class LocalCollection:
    def __init__(self, filepath: Path):
        self.filepath = filepath
        self._ensure_file()

    def _ensure_file(self):
        if not self.filepath.exists():
            self.filepath.parent.mkdir(parents=True, exist_ok=True)
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump([], f)

    def _read_all(self) -> List[Dict[str, Any]]:
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _write_all(self, items: List[Dict[str, Any]]):
        with open(self.filepath, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)

    def _match(self, item: Dict[str, Any], query: Dict[str, Any]) -> bool:
        if not query:
            return True
        for k, v in query.items():
            if k == "$or":
                sub_matches = [self._match(item, cond) for cond in v]
                if not any(sub_matches):
                    return False
                continue
            
            # Dot notation support (e.g. "compliance.verdict")
            parts = k.split(".")
            curr = item
            found = True
            for p in parts:
                if isinstance(curr, dict) and p in curr:
                    curr = curr[p]
                else:
                    found = False
                    break
            
            if not found:
                return False
            
            if isinstance(v, dict):
                if "$regex" in v:
                    pattern = v["$regex"]
                    flags = v.get("$options", "")
                    import re
                    reg_flags = re.IGNORECASE if "i" in flags else 0
                    if not curr or not isinstance(curr, str) or not re.search(pattern, curr, reg_flags):
                        return False
                elif "$in" in v:
                    if curr not in v["$in"]:
                        return False
            else:
                if curr != v:
                    return False
        return True

    async def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, int]] = None) -> Optional[Dict[str, Any]]:
        items = self._read_all()
        for item in items:
            if self._match(item, query):
                res = dict(item)
                if projection:
                    if projection.get("_id") == 0:
                        res.pop("_id", None)
                    if projection.get("password_hash") == 0:
                        res.pop("password_hash", None)
                    if projection.get("image_base64") == 0:
                        res.pop("image_base64", None)
                return res
        return None

    async def insert_one(self, doc: Dict[str, Any]):
        items = self._read_all()
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        items.append(doc_copy)
        self._write_all(items)
        return doc_copy

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        items = self._read_all()
        updated = False
        for i, item in enumerate(items):
            if self._match(item, query):
                if "$set" in update:
                    for k, v in update["$set"].items():
                        item[k] = v
                items[i] = item
                updated = True
                break
        if updated:
            self._write_all(items)

    async def delete_one(self, query: Dict[str, Any]):
        items = self._read_all()
        new_items = [item for item in items if not self._match(item, query)]
        self._write_all(new_items)

    async def count_documents(self, query: Dict[str, Any]) -> int:
        items = self._read_all()
        return sum(1 for item in items if self._match(item, query))

    async def create_index(self, key: str, unique: bool = False):
        pass

    def find(self, query: Dict[str, Any], projection: Optional[Dict[str, int]] = None):
        return LocalCursor(self._read_all(), query, projection)

    async def aggregate(self, pipeline: List[Dict[str, Any]]):
        items = self._read_all()
        cur_data = list(items)
        for step in pipeline:
            if "$match" in step:
                cur_data = [item for item in cur_data if self._match(item, step["$match"])]
            elif "$unwind" in step:
                field_path = step["$unwind"].lstrip("$")
                unwound = []
                for item in cur_data:
                    parts = field_path.split(".")
                    val = item
                    for p in parts:
                        val = val.get(p) if isinstance(val, dict) else None
                    if isinstance(val, list):
                        for elem in val:
                            new_item = dict(item)
                            new_item[parts[-1]] = elem
                            unwound.append(new_item)
                cur_data = unwound
            elif "$group" in step:
                grp = step["$group"]
                groups = {}
                for item in cur_data:
                    # evaluate group _id
                    gid = grp["_id"]
                    if isinstance(gid, str) and gid.startswith("$"):
                        fpath = gid[1:].split(".")
                        gval = item
                        for p in fpath:
                            gval = gval.get(p) if isinstance(gval, dict) else None
                    elif isinstance(gid, dict) and "$substr" in gid:
                        field_ref, start, length = gid["$substr"]
                        fpath = field_ref[1:].split(".")
                        gval = item
                        for p in fpath:
                            gval = gval.get(p) if isinstance(gval, dict) else None
                        gval = str(gval)[start:start+length] if gval else None
                    else:
                        gval = gid

                    key_str = str(gval)
                    if key_str not in groups:
                        groups[key_str] = {"_id": gval, "count": 0, "total": 0, "compliant": 0, "items": []}
                    groups[key_str]["count"] += 1
                    groups[key_str]["items"].append(item)
                    
                    if "total" in grp:
                        groups[key_str]["total"] += 1
                    if "compliant" in grp:
                        cond = grp["compliant"].get("$sum", {}).get("$cond", [])
                        if cond and cond[0].get("$eq") == ["$compliance.verdict", "COMPLIANT"]:
                            if item.get("compliance", {}).get("verdict") == "COMPLIANT":
                                groups[key_str]["compliant"] += 1

                cur_data = list(groups.values())
            elif "$sort" in step:
                sort_spec = step["$sort"]
                for skey, sdir in sort_spec.items():
                    cur_data.sort(key=lambda x: x.get(skey, 0) or 0, reverse=(sdir == -1))
            elif "$limit" in step:
                cur_data = cur_data[:step["$limit"]]

        class AsyncGen:
            def __init__(self, data):
                self.data = data
            def __aiter__(self):
                return self._gen()
            async def _gen(self):
                for d in self.data:
                    yield d

        return AsyncGen(cur_data)

class LocalCursor:
    def __init__(self, items: List[Dict[str, Any]], query: Dict[str, Any], projection: Optional[Dict[str, int]] = None):
        self.coll = LocalCollection(Path("data_dummy.json")) # reference for matching logic
        self.items = [item for item in items if self.coll._match(item, query)]
        self.projection = projection

    def sort(self, key: str, direction: int = 1):
        self.items.sort(key=lambda x: x.get(key, ""), reverse=(direction == -1))
        return self

    def limit(self, n: int):
        self.items = self.items[:n]
        return self

    async def to_list(self, length: int) -> List[Dict[str, Any]]:
        result = []
        for item in self.items[:length]:
            res = dict(item)
            if self.projection:
                if self.projection.get("_id") == 0:
                    res.pop("_id", None)
                if self.projection.get("password_hash") == 0:
                    res.pop("password_hash", None)
                if self.projection.get("image_base64") == 0:
                    res.pop("image_base64", None)
            result.append(res)
        return result

class LocalDB:
    def __init__(self, data_dir: Path):
        self.users = LocalCollection(data_dir / "users.json")
        self.scans = LocalCollection(data_dir / "scans.json")

def get_database():
    mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.environ.get("DB_NAME", "legal_metrology")
    
    # Try motor first if MONGO_URL is provided, else fallback to LocalDB
    use_motor = False
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        # Attempt quick sync socket check
        import socket
        host = mongo_url.split("//")[-1].split(":")[0].split("/")[0]
        port = int(mongo_url.split(":")[-1].split("/")[0]) if ":" in mongo_url.split("//")[-1] else 27017
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        if s.connect_ex((host, port)) == 0:
            use_motor = True
        s.close()
    except Exception:
        use_motor = False

    if use_motor:
        logger.info("Using MongoDB via Motor client")
        client = AsyncIOMotorClient(mongo_url)
        return client, client[db_name]
    else:
        logger.info("MongoDB not connected. Falling back to local JSON database storage")
        data_dir = Path(__file__).parent / "data"
        db = LocalDB(data_dir)
        return None, db
