from datetime import time

from pydantic import BaseModel, Field


class AlarmConfigIn(BaseModel):
    device_id: str = Field(..., min_length=1, max_length=64)
    wake_time: time
    window_start: time
    window_minutes: int = Field(default=30, ge=5, le=120)
    enabled: bool = True


class AlarmConfigOut(BaseModel):
    device_id: str
    wake_time: time
    window_start: time
    window_minutes: int
    enabled: bool

    model_config = {"from_attributes": True}


class AlarmTestIn(BaseModel):
    device_id: str = Field(..., min_length=1, max_length=64)
    alarm_duration_s: int = Field(default=10, ge=1, le=60)
