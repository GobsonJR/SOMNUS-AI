from fastapi import APIRouter

from app.config import get_settings
from app.runtime import runtime

router = APIRouter(tags=["health"])
settings = get_settings()


@router.get("/health")
async def health_check() -> dict:
    return {
        "status": "ok",
        "service": "somnus-backend",
        "inference_enabled": runtime.inference_enabled,
        "http_ingest": f"/api/v1/devices/{settings.configured_device_id}/telemetry/rr-epoch",
    }
