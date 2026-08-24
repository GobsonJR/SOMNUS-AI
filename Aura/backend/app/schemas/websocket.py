from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel


class StageUpdateMessage(BaseModel):
    type: Literal["STAGE_UPDATE"] = "STAGE_UPDATE"
    device_id: str
    timestamp: datetime
    stage: str
    n2_probability: float
    features: dict[str, Any]
    epoch_id: str | None = None


class AlarmTriggerMessage(BaseModel):
    type: Literal["ALARM_TRIGGER"] = "ALARM_TRIGGER"
    device_id: str
    timestamp: datetime
    reason: str
    wake_event_id: str


class ConnectionStatusMessage(BaseModel):
    type: Literal["CONNECTION_STATUS"] = "CONNECTION_STATUS"
    device_id: str
    state: str
    timestamp: datetime
