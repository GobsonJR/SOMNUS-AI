from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class EpochOut(BaseModel):
    id: UUID
    device_id: str
    epoch_started_at: datetime
    n2_probability: float | None
    stage: str | None
    features: dict | None
    lead_off: bool
    battery_pct: int | None

    model_config = {"from_attributes": True}


class EpochListResponse(BaseModel):
    items: list[EpochOut]
    total: int
