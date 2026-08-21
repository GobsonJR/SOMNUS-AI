from fastapi import APIRouter, Depends, HTTPException, status

from app.core.ingestor import Ingestor
from app.runtime import runtime

router = APIRouter(prefix="/api/v1/devices", tags=["telemetry"])


def get_ingestor() -> Ingestor:
    if runtime.ingestor is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Ingestor not ready")
    return runtime.ingestor


@router.post("/{device_id}/telemetry/rr-epoch")
async def post_rr_epoch(device_id: str, payload: dict, ingestor: Ingestor = Depends(get_ingestor)) -> dict:
    """Accept RR epoch telemetry directly from ESP32 over HTTP (Arduino IDE path)."""
    result = await ingestor.ingest_http_epoch(device_id, payload)
    if not result.get("accepted"):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=result)
    return result
