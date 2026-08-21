# Somnus — Smart Sleep Stage Monitor & Alarm

> **Somnus** is a low-cost, ECG-based sleep staging and smart wake system. It uses single-lead ECG (AD8232 + ESP32) to extract RR intervals, computes Heart Rate Variability (HRV) features, and runs a lightweight ML model to classify sleep stages in real time. A smart alarm wakes the user during an optimal N2 (light sleep) window instead of deep sleep.

---

## What This Project Does

1. **ECG Acquisition** — AD8232 single-lead ECG sampled by ESP32 at 250 Hz.
2. **R-Peak Detection** — Pan–Tompkins QRS detector running on-device.
3. **RR Interval Streaming** — 30-second epochs of RR intervals sent via MQTT.
4. **HRV Feature Extraction** — Time-domain, frequency-domain, and non-linear features computed server-side.
5. **ML Inference** — ONNX XGBoost model predicts N2 probability and coarse sleep stage (NREM / REM / Wake).
6. **Smart Wake Logic** — If 3 consecutive epochs are classified as N2 inside the user’s wake window, trigger the alarm. Otherwise, force-wake at the deadline.
7. **Live Dashboard** — React frontend shows real-time hypnogram, HRV metrics, and alarm status.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Sensor | AD8232 ECG Module + ESP32 DevKit |
| Firmware | Arduino / PlatformIO (C++) |
| Transport | MQTT (Eclipse Mosquitto) |
| Backend | FastAPI + Uvicorn (Python) |
| ML | XGBoost → ONNX Runtime |
| Feature Eng. | hrv-analysis + NeuroKit2 |
| Cache / State | Redis |
| Database | PostgreSQL + TimescaleDB |
| Frontend | React (Vite) + TailwindCSS |
| Deploy | Docker Compose |

---

## Repository Structure

```
somnus/
├── firmware/          # ESP32 code (PlatformIO)
├── backend/           # FastAPI REST + MQTT + WebSocket
├── ml/                # Offline training pipeline
├── frontend/          # React dashboard
├── infra/             # Docker, Mosquitto, Nginx, mock scripts
├── docker-compose.yml
└── README.md          # This file
```

---

## Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for frontend dev outside container)
- Python 3.11+ (for ML / backend dev outside container)
- PlatformIO CLI (for firmware)

### 1. Clone & Enter
```bash
git clone <repo-url>
cd somnus
```

### 2. Start Infrastructure
```bash
docker-compose up -d mosquitto redis postgres
```

### 3. Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Mock ESP32 (no hardware needed)
```bash
python infra/scripts/mock_esp32.py --device-id esp32_01 --replay data/sample_rr.json
```

---

## Team

- David Immanuel Gobson — Hardware / Firmware
- B Praveen — ML / Backend / Frontend

---

## License

MIT
