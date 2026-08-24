"""Runtime objects shared by request handlers without import cycles."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING

from app.services.mqtt_client import MqttService

if TYPE_CHECKING:
    from app.core.ingestor import Ingestor


class Runtime:
    mqtt_service: MqttService | None = None
    ingestor: Ingestor | None = None
    model_approved: bool = False
    model_reason: str = "MODEL_MANIFEST_MISSING"
    inference_enabled: bool = False
    migration_ready: bool = False

    @staticmethod
    def wake_window_key() -> str:
        return datetime.now(timezone.utc).date().isoformat()


runtime = Runtime()
