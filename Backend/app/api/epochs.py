from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import crud
from app.db.session import get_db
from app.schemas.epoch import EpochListResponse, EpochOut

router = APIRouter(prefix="/epochs", tags=["epochs"])


@router.get("", response_model=EpochListResponse)
async def list_epochs(
    device_id: str = Query(..., min_length=1),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
) -> EpochListResponse:
    epochs = await crud.get_recent_epochs(db, device_id, limit=limit)
    items = [EpochOut.model_validate(e) for e in reversed(epochs)]
    return EpochListResponse(items=items, total=len(items))
