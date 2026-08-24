import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware

from app.api import alarm, chat, dashboard, epochs, health, telemetry
from app.config import get_settings
from app.core.ingestor import Ingestor
from app.core.model_approval import validate_model_artifacts
from app.core.predictor import Predictor
from app.core.smart_wake import SmartWakeEngine
from app.db.models import Base
from app.db.session import engine
from app.runtime import runtime
from app.services.mqtt_client import MqttService
from app.services.redis_client import RedisClient
from app.services.websocket_manager import WebSocketManager

logger = logging.getLogger(__name__)
settings = get_settings()

ws_manager = WebSocketManager()
redis_client = RedisClient()
predictor = Predictor(settings.model_n2_path, settings.model_stage_path, settings.feature_columns_path)
smart_wake = SmartWakeEngine(theta=settings.theta, k_consecutive=settings.k_consecutive)
event_loop: asyncio.AbstractEventLoop | None = None


def _schedule_mqtt_handler(topic: str, payload: dict) -> None:
    if runtime.ingestor is None or event_loop is None:
        return
    event_loop.call_soon_threadsafe(asyncio.create_task, runtime.ingestor.handle_mqtt_message(topic, payload))


@asynccontextmanager
async def lifespan(app: FastAPI):
    global event_loop
    event_loop = asyncio.get_running_loop()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    runtime.migration_ready = True

    await redis_client.connect()

    approval = validate_model_artifacts(
        settings.model_n2_path,
        settings.model_stage_path,
        settings.feature_columns_path,
        settings.model_manifest_path,
        min_n2_f1=settings.model_min_n2_f1,
        min_n2_recall=settings.model_min_n2_recall,
    )
    runtime.model_approved = approval.approved
    runtime.model_reason = approval.reason
    runtime.inference_enabled = predictor.is_ready and (approval.approved or settings.dev_inference_enabled)

    runtime.mqtt_service = MqttService(
        on_message=_schedule_mqtt_handler,
        auto_wake_allowed=settings.auto_wake_enabled and approval.approved,
    )
    runtime.ingestor = Ingestor(
        predictor=predictor,
        smart_wake=smart_wake,
        ws_manager=ws_manager,
        redis_client=redis_client,
        mqtt_service=runtime.mqtt_service,
        theta=settings.theta,
        k_consecutive=settings.k_consecutive,
        inference_enabled=runtime.inference_enabled,
    )
    runtime.mqtt_service.start()

    logger.info(
        "Somnus backend started inference=%s models=%s mqtt=%s device=%s",
        runtime.inference_enabled,
        runtime.model_reason,
        settings.mqtt_broker,
        settings.configured_device_id or "(any)",
    )

    yield

    if runtime.mqtt_service:
        runtime.mqtt_service.stop()
    runtime.mqtt_service = None
    runtime.ingestor = None
    await redis_client.close()
    await engine.dispose()


app = FastAPI(title="Somnus API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(telemetry.router)
app.include_router(alarm.router)
app.include_router(epochs.router)
app.include_router(dashboard.router)
app.include_router(chat.router)


@app.get("/ready", tags=["health"])
async def readiness() -> dict:
    checks = {
        "database": False,
        "redis": False,
        "mqtt": False,
        "onnx_models": predictor.is_ready,
        "inference_enabled": runtime.inference_enabled,
        "model_approved": runtime.model_approved,
        "device_configured": bool(settings.configured_device_id),
    }
    try:
        async with engine.connect() as conn:
            await conn.exec_driver_sql("SELECT 1")
        checks["database"] = True
    except Exception:
        pass
    try:
        checks["redis"] = bool(redis_client._client and await redis_client._client.ping())
    except Exception:
        pass
    checks["mqtt"] = bool(runtime.mqtt_service and runtime.mqtt_service.is_connected)

    # HTTP ingest from ESP32 works without MQTT; DB + Redis + ONNX are required for ML.
    ready = checks["database"] and checks["redis"] and checks["onnx_models"]
    payload = {
        "status": "ready" if ready else "not_ready",
        "checks": checks,
        "model_reason": runtime.model_reason,
        "http_ingest": f"/api/v1/devices/{settings.configured_device_id or '{device_id}'}/telemetry/rr-epoch",
        "auto_wake_enabled": bool(runtime.mqtt_service and runtime.mqtt_service.auto_wake_allowed),
    }
    if not ready:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=payload)
    return payload


@app.websocket("/ws/{device_id}")
async def websocket_endpoint(websocket: WebSocket, device_id: str) -> None:
    await ws_manager.connect(websocket, device_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, device_id)
