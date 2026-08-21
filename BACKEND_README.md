# Backend — FastAPI + MQTT + WebSocket

> Located in `backend/`. The central nervous system of Somnus.

---

## Responsibilities

1. **Ingest** RR interval epochs from ESP32 via MQTT.
2. **Validate & clean** RR data (artifact removal).
3. **Extract HRV features** (time, frequency, non-linear).
4. **Run ONNX inference** to get N2 probability and sleep stage.
5. **Apply smart wake logic** (consecutive N2 check + wake window).
6. **Broadcast** results to frontend via WebSocket.
7. **Persist** epochs and alarm events to PostgreSQL.

---

## Directory Layout

```
backend/
├── Dockerfile
├── requirements.txt
├── app/
│   ├── __init__.py
│   ├── main.py               # FastAPI app factory, lifespan
│   ├── config.py             # Pydantic Settings (env vars)
│   ├── api/
│   │   ├── __init__.py
│   │   ├── health.py         # GET /health
│   │   ├── alarm.py          # POST/GET /alarm/config
│   │   ├── epochs.py         # GET /epochs (paginated history)
│   │   └── dashboard.py      # GET /dashboard/summary
│   ├── core/
│   │   ├── __init__.py
│   │   ├── ingestor.py       # MQTT consumer + validator
│   │   ├── feature_engine.py # RR cleaning + HRV extraction
│   │   ├── predictor.py      # ONNX model wrapper
│   │   ├── smart_wake.py     # N2 stability + wake window logic
│   │   └── notifier.py       # WebSocket + MQTT publish
│   ├── db/
│   │   ── __init__.py
│   │   ├── session.py        # SQLAlchemy async engine
│   │   ├── models.py         # ORM tables
│   │   └── crud.py           # DB operations
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── epoch.py
│   │   ├── alarm.py
│   │   └── websocket.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── mqtt_client.py    # paho-mqtt wrapper
│   │   ├── redis_client.py   # redis-py async wrapper
│   │   └── websocket_manager.py
│   └── models/               # Trained ONNX assets (read-only)
│       ├── model_n2.onnx
│       ├── model_stage.onnx
│       └── feature_columns.json
├── alembic/                  # DB migrations
└── tests/
    ├── test_ingestor.py
    ├── test_smart_wake.py
    └── test_api.py
```

---

## Key Modules

### `core/feature_engine.py`

Uses `hrv-analysis` to compute features from a 30-second RR interval list:

- **Time-domain:** mean_rr, sdnn, rmssd, pnn50, median_rr, min_rr, max_rr
- **Frequency-domain:** lf, hf, lf_hf_ratio, lfnu, hfnu (Welch periodogram)
- **Non-linear:** sd1, sd2, sd1_sd2_ratio

> This file must be **identical** to `ml/src/features.py` to avoid train/inference skew.

### `core/predictor.py`

Loads `model_n2.onnx` and `model_stage.onnx` via ONNX Runtime. Accepts a feature dict and returns:

```python
{
  "n2_probability": 0.83,
  "stage": "NREM"   # or "REM", "Wake"
}
```

### `core/smart_wake.py`

Implements the wake logic from your pitch deck:

```
IF 3 consecutive epochs have N2 probability >= THETA (0.70)
   AND current time is inside user's wake window
THEN trigger alarm (N2_CONFIRMED)

ELSE IF current time >= deadline
THEN force trigger alarm (FORCE_WAKE)
```

State (recent N2 flags) is stored in Redis per device.

### `services/websocket_manager.py`

Manages frontend WebSocket connections. On each new epoch inference:

```python
await manager.broadcast(device_id, {
    "type": "STAGE_UPDATE",
    "timestamp": "2026-08-21T06:31:00Z",
    "stage": "NREM",
    "n2_probability": 0.83,
    "features": {...}
})
```

---

## Environment Variables (`.env`)

```bash
# Database
DATABASE_URL=postgresql+asyncpg://somnus:somnus@postgres:5432/sleepdb

# MQTT
MQTT_BROKER=mosquitto
MQTT_PORT=1883
MQTT_TOPIC_IN=somnus/rr/+
MQTT_TOPIC_OUT=somnus/alarm/{device_id}

# Redis
REDIS_URL=redis://redis:6379/0

# ML
MODEL_N2_PATH=app/models/model_n2.onnx
MODEL_STAGE_PATH=app/models/model_stage.onnx
FEATURE_COLUMNS_PATH=app/models/feature_columns.json

# Wake Logic
THETA=0.70
K_CONSECUTIVE=3
WINDOW_MINUTES_DEFAULT=30
```

---

## Run Locally

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at `http://localhost:8000/docs`.
