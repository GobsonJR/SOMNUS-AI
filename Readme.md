# Somnus

Smart sleep stage monitor and alarm system. See [PROJECT_README.md](PROJECT_README.md) for architecture and quick start.

## Cursor implementation status

- `backend/` — FastAPI + MQTT + WebSocket + PostgreSQL
- `frontend/` — React marketing site + live dashboard
- `ml/` — Training pipeline scripts
- `firmware/` — ESP32 PlatformIO project
- `infra/` — Docker, Mosquitto, mock device script

## LAN deployment

```bash
Follow [infra/DEPLOY_LAN.md](infra/DEPLOY_LAN.md). The production stack accepts data only from an authenticated ESP32, stores accepted epochs in TimescaleDB/PostgreSQL, and will not automatically wake anyone without approved ONNX model artifacts.
```
