"""Validation for the versioned device MQTT contract."""

from __future__ import annotations

import re
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator

DEVICE_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{1,64}$")


class SignalQuality(BaseModel):
    accepted_beats: int = Field(ge=0)
    rejected_candidates: int = Field(default=0, ge=0)


class RrEpochMessage(BaseModel):
    protocol_version: str = "1.0"
    message_id: str = Field(min_length=1, max_length=64)
    device_id: str = Field(min_length=1, max_length=64)
    sent_at: datetime
    epoch_started_at: datetime
    epoch_duration_ms: int
    sequence: int = Field(ge=0)
    rr_intervals_ms: list[int]
    sampling_rate_hz: int
    lead_off: bool = False
    battery_pct: int | None = Field(default=None, ge=0, le=100)
    signal_quality: SignalQuality | None = None
    clock_synced: bool = True

    @field_validator("device_id")
    @classmethod
    def validate_device_id(cls, value: str) -> str:
        if not DEVICE_ID_PATTERN.fullmatch(value):
            raise ValueError("invalid device_id")
        return value

    @field_validator("rr_intervals_ms")
    @classmethod
    def validate_rr(cls, values: list[int]) -> list[int]:
        if not 2 <= len(values) <= 80:
            raise ValueError("rr_intervals_ms must contain 2-80 intervals")
        if any(value < 250 or value > 2500 for value in values):
            raise ValueError("RR intervals must be between 250 and 2500 ms")
        return values

    @model_validator(mode="after")
    def validate_contract(self) -> "RrEpochMessage":
        if self.protocol_version != "1.0":
            raise ValueError("unsupported protocol version")
        if self.epoch_duration_ms != 30000:
            raise ValueError("v1 requires 30-second epochs")
        if self.sampling_rate_hz != 250:
            raise ValueError("v1 requires 250 Hz sampling")
        return self


def topic_device_id(topic: str) -> str | None:
    parts = topic.split("/")
    return parts[3] if len(parts) >= 6 and parts[:3] == ["somnus", "v1", "devices"] else None


def as_payload(model: BaseModel) -> dict[str, Any]:
    return model.model_dump(mode="json")
