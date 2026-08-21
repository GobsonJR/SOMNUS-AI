from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import crud
from app.db.session import get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
async def dashboard_summary(
    device_id: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
) -> dict:
    epochs = await crud.get_recent_epochs(db, device_id, limit=1)
    config = await crud.get_alarm_config(db, device_id)
    latest = epochs[0] if epochs else None

    return {
        "device_id": device_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "current_stage": latest.stage if latest else None,
        "n2_probability": latest.n2_probability if latest else None,
        "rmssd": (latest.features or {}).get("rmssd") if latest and latest.features else None,
        "alarm_enabled": config.enabled if config else False,
        "wake_time": str(config.wake_time) if config else None,
        "window_start": str(config.window_start) if config else None,
    }
