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
                    regex_flags = re.IGNORECASE if "i" in flags else 0
                    if not re.search(pattern, str(curr), regex_flags):
                        return False
            elif curr != v:
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

    def find(self, query: Dict[str, Any], projection: Optional[Dict[str, int]] = None):
        items = self._read_all()
        return LocalCursor(items, query, projection)

    async def insert_one(self, document: Dict[str, Any]):
        items = self._read_all()
        doc_copy = dict(document)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        items.append(doc_copy)
        self._write_all(items)
        class Result:
            inserted_id = doc_copy["_id"]
        return Result()

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        items = self._read_all()
        updated = False
        for item in items:
            if self._match(item, query):
                if "$set" in update:
                    for k, v in update["$set"].items():
                        item[k] = v
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

    async def aggregate(self, pipeline: List[Dict[str, Any]]):
        items = self._read_all()
        cur_data = list(items)
        for step in pipeline:
            if "$match" in step:
                cur_data = [d for d in cur_data if self._match(d, step["$match"])]
            elif "$group" in step:
                gspec = step["$group"]
                gid = gspec.get("_id")
                groups = {}
                for d in cur_data:
                    key_val = d.get(gid.replace("$", "")) if isinstance(gid, str) and gid.startswith("$") else None
                    if key_val not in groups:
                        groups[key_val] = {"_id": key_val}
                    for field, expr in gspec.items():
                        if field == "_id": continue
                        if "$sum" in expr:
                            val = expr["$sum"]
                            groups[key_val][field] = groups[key_val].get(field, 0) + (1 if val == 1 else 0)
                        elif "$avg" in expr:
                            arg = expr["$avg"].replace("$", "")
                            groups[key_val].setdefault("_vals", []).append(d.get(arg, 0))
                            groups[key_val][field] = sum(groups[key_val]["_vals"]) / len(groups[key_val]["_vals"])
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
        self.coll = LocalCollection(Path("data_dummy.json"))
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
    mongo_url = os.environ.get("MONGO_URL", "").strip()
    db_name = os.environ.get("DB_NAME", "legal_metrology").strip()
    
    if mongo_url:
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            import certifi
            logger.info(f"Using MongoDB via Motor client for database '{db_name}'")
            try:
                client = AsyncIOMotorClient(mongo_url, tlsCAFile=certifi.where())
            except Exception:
                client = AsyncIOMotorClient(mongo_url)
            return client, client[db_name]
        except Exception as e:
            logger.warning(f"Motor MongoDB connection failed: {e}. Falling back to local JSON DB.")
    
    logger.info("MONGO_URL not configured. Falling back to local JSON database storage")
    data_dir = Path(__file__).parent / "data"
    db = LocalDB(data_dir)
    return None, db
