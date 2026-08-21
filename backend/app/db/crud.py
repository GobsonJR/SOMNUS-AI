from datetime import datetime, time, timezone
from uuid import UUID

from sqlalchemy import desc, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import AlarmConfig, DeviceStatus, Epoch, WakeEvent


async def epoch_exists(session: AsyncSession, device_id: str, message_id: str) -> bool:
    result = await session.execute(
        select(Epoch.id).where(Epoch.device_id == device_id, Epoch.message_id == message_id).limit(1)
    )
    return result.scalar_one_or_none() is not None


async def create_epoch(session: AsyncSession, **kwargs) -> Epoch:
    epoch = Epoch(**kwargs)
    session.add(epoch)
    await session.commit()
    await session.refresh(epoch)
    return epoch


async def update_epoch_inference(
    session: AsyncSession,
    epoch_id: UUID,
    *,
    features: dict,
    n2_probability: float,
    stage: str,
) -> None:
    result = await session.execute(select(Epoch).where(Epoch.id == epoch_id))
    epoch = result.scalar_one()
    epoch.features = features
    epoch.n2_probability = n2_probability
    epoch.stage = stage
    await session.commit()


async def get_recent_epochs(session: AsyncSession, device_id: str, limit: int = 100) -> list[Epoch]:
    result = await session.execute(
        select(Epoch)
        .where(Epoch.device_id == device_id, Epoch.usable.is_(True))
        .order_by(desc(Epoch.epoch_started_at))
        .limit(limit)
    )
    return list(result.scalars().all())


async def get_alarm_config(session: AsyncSession, device_id: str) -> AlarmConfig | None:
    result = await session.execute(select(AlarmConfig).where(AlarmConfig.device_id == device_id))
    return result.scalar_one_or_none()


async def upsert_alarm_config(
    session: AsyncSession,
    device_id: str,
    wake_time: time,
    window_start: time,
    window_minutes: int,
    enabled: bool = True,
) -> AlarmConfig:
    config = await get_alarm_config(session, device_id)
    if config is None:
        config = AlarmConfig(
            device_id=device_id,
            wake_time=wake_time,
            window_start=window_start,
            window_minutes=window_minutes,
            enabled=enabled,
        )
        session.add(config)
    else:
        config.wake_time = wake_time
        config.window_start = window_start
        config.window_minutes = window_minutes
        config.enabled = enabled
    await session.commit()
    await session.refresh(config)
    return config


async def create_wake_event(
    session: AsyncSession,
    wake_event_id: str,
    device_id: str,
    reason: str,
    wake_window_key: str,
    command_expires_at: datetime,
    *,
    status: str = "PUBLISHED",
) -> WakeEvent | None:
    event = WakeEvent(
        id=wake_event_id,
        device_id=device_id,
        reason=reason,
        wake_window_key=wake_window_key,
        status=status,
        command_expires_at=command_expires_at,
    )
    session.add(event)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        return None
    await session.refresh(event)
    return event


async def mark_wake_delivered(session: AsyncSession, wake_event_id: str) -> None:
    result = await session.execute(select(WakeEvent).where(WakeEvent.id == wake_event_id))
    event = result.scalar_one_or_none()
    if event:
        event.delivered = True
        event.status = "ALARM_STARTED"
        event.alarm_started_at = datetime.now(timezone.utc)
        await session.commit()


async def mark_wake_failed(session: AsyncSession, wake_event_id: str, status: str = "ALARM_FAILED") -> None:
    result = await session.execute(select(WakeEvent).where(WakeEvent.id == wake_event_id))
    event = result.scalar_one_or_none()
    if event:
        event.status = status
        await session.commit()


async def upsert_device_status(session: AsyncSession, device_id: str, **kwargs) -> None:
    result = await session.execute(select(DeviceStatus).where(DeviceStatus.device_id == device_id))
    status = result.scalar_one_or_none()
    if status is None:
        status = DeviceStatus(device_id=device_id, **kwargs)
        session.add(status)
    else:
        for key, value in kwargs.items():
            setattr(status, key, value)
        status.last_seen_at = datetime.now(timezone.utc)
    await session.commit()
