from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.core.protocol import RrEpochMessage


def valid_payload() -> dict:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "protocol_version": "1.0", "message_id": "epoch-1", "device_id": "esp32_01", "sent_at": now,
        "epoch_started_at": now, "epoch_duration_ms": 30000, "sequence": 1,
        "rr_intervals_ms": [900, 910, 890], "sampling_rate_hz": 250, "lead_off": False,
    }


def test_accepts_v1_epoch_contract():
    assert RrEpochMessage.model_validate(valid_payload()).device_id == "esp32_01"


def test_rejects_invalid_rr_value():
    payload = valid_payload()
    payload["rr_intervals_ms"] = [100, 900]
    with pytest.raises(ValidationError):
        RrEpochMessage.model_validate(payload)


def test_rejects_unsupported_epoch_duration():
    payload = valid_payload()
    payload["epoch_duration_ms"] = 60000
    with pytest.raises(ValidationError):
        RrEpochMessage.model_validate(payload)
