from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import crud
from app.db.session import get_db
from app.schemas.alarm import AlarmConfigIn, AlarmConfigOut, AlarmTestIn
from app.core.operator_auth import require_operator_pin
from app.runtime import runtime

router = APIRouter(prefix="/alarm", tags=["alarm"])


@router.get("/config/{device_id}", response_model=AlarmConfigOut)
async def get_alarm_config(device_id: str, db: AsyncSession = Depends(get_db)) -> AlarmConfigOut:
    config = await crud.get_alarm_config(db, device_id)
    if config is None:
        from datetime import time

        return AlarmConfigOut(
            device_id=device_id,
            wake_time=time(7, 0),
            window_start=time(6, 30),
            window_minutes=30,
            enabled=False,
        )
    return AlarmConfigOut.model_validate(config)


@router.post("/config", response_model=AlarmConfigOut, dependencies=[Depends(require_operator_pin)])
async def set_alarm_config(body: AlarmConfigIn, db: AsyncSession = Depends(get_db)) -> AlarmConfigOut:
    config = await crud.upsert_alarm_config(
        db,
        device_id=body.device_id,
        wake_time=body.wake_time,
        window_start=body.window_start,
        window_minutes=body.window_minutes,
        enabled=body.enabled,
    )
    return AlarmConfigOut.model_validate(config)


@router.post("/test", dependencies=[Depends(require_operator_pin)])
async def test_alarm(body: AlarmTestIn, db: AsyncSession = Depends(get_db)) -> dict:
    if runtime.mqtt_service is None or not runtime.mqtt_service.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MQTT is unavailable")
    event_id, payload = runtime.mqtt_service.build_alarm(
        body.device_id, "MANUAL_TEST", alarm_duration_s=body.alarm_duration_s
    )
    event = await crud.create_wake_event(
        db, event_id, body.device_id, "MANUAL_TEST", runtime.wake_window_key(), payload["expires_at"], status="PUBLISHED"
    )
    if event is None or not runtime.mqtt_service.publish_alarm(body.device_id, payload):
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Alarm command could not be published")
    return {"wake_event_id": event_id, "status": "PUBLISHED"}
