import json
import logging
from typing import Any

import redis.asyncio as redis

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class RedisClient:
    def __init__(self) -> None:
        self._client: redis.Redis | None = None

    async def connect(self) -> None:
        self._client = redis.from_url(settings.redis_url, decode_responses=True)

    async def close(self) -> None:
        if self._client:
            await self._client.close()

    async def get_json(self, key: str) -> dict[str, Any] | None:
        if not self._client:
            return None
        raw = await self._client.get(key)
        return json.loads(raw) if raw else None

    async def set_json(self, key: str, value: dict[str, Any], ttl: int | None = None) -> None:
        if not self._client:
            return
        await self._client.set(key, json.dumps(value), ex=ttl)

    async def push_n2_flag(self, device_id: str, is_n2: bool, k: int) -> list[bool]:
        if not self._client:
            return [is_n2]
        key = f"n2_flags:{device_id}"
        await self._client.rpush(key, "1" if is_n2 else "0")
        await self._client.ltrim(key, -k, -1)
        flags = await self._client.lrange(key, 0, -1)
        return [f == "1" for f in flags]
