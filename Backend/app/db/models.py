import uuid
from datetime import datetime, time

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    Time,
    UniqueConstraint,
    Index,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Epoch(Base):
    __tablename__ = "epochs"
    __table_args__ = (
        UniqueConstraint("device_id", "message_id", "epoch_started_at", name="uq_epoch_device_message_time"),
        Index("ix_epochs_device_started", "device_id", "epoch_started_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id: Mapped[str] = mapped_column(String(64), index=True)
    message_id: Mapped[str] = mapped_column(String(64))
    epoch_started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), primary_key=True)
    sequence: Mapped[int] = mapped_column(Integer)
    rr_intervals_ms: Mapped[list] = mapped_column(JSONB)
    lead_off: Mapped[bool] = mapped_column(Boolean, default=False)
    battery_pct: Mapped[int | None] = mapped_column(Integer, nullable=True)
    signal_quality: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    features: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    n2_probability: Mapped[float | None] = mapped_column(Float, nullable=True)
    stage: Mapped[str | None] = mapped_column(String(16), nullable=True)
    usable: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AlarmConfig(Base):
    __tablename__ = "alarm_configs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    wake_time: Mapped[time] = mapped_column(Time)
    window_start: Mapped[time] = mapped_column(Time)
    window_minutes: Mapped[int] = mapped_column(Integer, default=30)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class WakeEvent(Base):
    __tablename__ = "wake_events"
    __table_args__ = (UniqueConstraint("device_id", "wake_window_key", name="uq_wake_event_device_window"),)

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    device_id: Mapped[str] = mapped_column(String(64), index=True)
    reason: Mapped[str] = mapped_column(String(32))
    wake_window_key: Mapped[str] = mapped_column(String(32))
    status: Mapped[str] = mapped_column(String(24), default="PUBLISHED")
    triggered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    delivered: Mapped[bool] = mapped_column(Boolean, default=False)
    alarm_started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    command_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class DeviceStatus(Base):
    __tablename__ = "device_status"

    device_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    state: Mapped[str] = mapped_column(String(16), default="OFFLINE")
    firmware_version: Mapped[str | None] = mapped_column(String(32), nullable=True)
    wifi_rssi_dbm: Mapped[int | None] = mapped_column(Integer, nullable=True)
    battery_pct: Mapped[int | None] = mapped_column(Integer, nullable=True)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
