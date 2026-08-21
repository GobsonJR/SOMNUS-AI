import asyncio
import json
import logging
from typing import Any

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class WebSocketManager:
    def __init__(self) -> None:
        self._connections: dict[str, set[WebSocket]] = {}
        self._global_connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket, device_id: str | None = None) -> None:
        await websocket.accept()
        if device_id:
            self._connections.setdefault(device_id, set()).add(websocket)
        else:
            self._global_connections.add(websocket)

    def disconnect(self, websocket: WebSocket, device_id: str | None = None) -> None:
        if device_id and device_id in self._connections:
            self._connections[device_id].discard(websocket)
            if not self._connections[device_id]:
                del self._connections[device_id]
        self._global_connections.discard(websocket)

    async def broadcast(self, device_id: str, message: dict[str, Any]) -> None:
        payload = json.dumps(message, default=str)
        targets = set(self._global_connections)
        targets.update(self._connections.get(device_id, set()))

        dead: list[WebSocket] = []
        for ws in targets:
            try:
                await ws.send_text(payload)
            except Exception:
                dead.append(ws)

        for ws in dead:
            self.disconnect(ws, device_id)
