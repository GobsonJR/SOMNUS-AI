# 🌙 Somnus — Smart Sleep Stage Monitor & Intelligent Wake System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![ESP32](https://img.shields.io/badge/ESP32-PlatformIO-E7352C.svg?logo=espressif&logoColor=white)](https://espressif.com)
[![TimescaleDB](https://img.shields.io/badge/Database-PostgreSQL_%2B_TimescaleDB-336791.svg?logo=postgresql&logoColor=white)](https://www.timescale.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)

> **Somnus** is an end-to-end, low-cost physiological sleep monitoring and smart alarm system. By acquiring single-lead ECG via an AD8232 sensor and ESP32 edge microcontroller, extracting R-peak intervals (RR series), and computing real-time Heart Rate Variability (HRV) metrics, Somnus predicts sleep stages using lightweight ONNX-quantized machine learning models. A smart wake engine identifies optimal **N2 (light sleep)** periods within a user-defined wake window to eliminate sleep inertia and grogginess.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [End-to-End Data Pipeline](#-end-to-end-data-pipeline)
- [Hardware & Pinout Setup](#-hardware--pinout-setup)
- [Technology Stack](#-technology-stack)
- [Repository Structure](#-repository-structure)
- [Quick Start (Local Development)](#-quick-start-local-development)
- [LAN Production Deployment](#-lan-production-deployment)
- [Machine Learning & Model Pipeline](#-machine-learning--model-pipeline)
- [API & WebSocket Specifications](#-api--websocket-specifications)
- [Contributors & Team](#-contributors--team)
- [License](#-license)

---

## ⚡ Core Features

- **High-Precision Biosignal Acquisition**: 250 Hz continuous single-lead ECG acquisition with real-time leads-off detection.
- **Edge Signal Processing**: Embedded Pan–Tompkins QRS detector running on the ESP32 to stream clean 30-second epoch RR interval packages over MQTT.
- **Multidimensional HRV Extraction**: Computes time-domain (RMSSD, SDNN, pNN50), frequency-domain (LF, HF, LF/HF ratio via Welch periodogram), and non-linear Poincaré features (SD1, SD2).
- **Lightweight ONNX ML Inference**: High-speed, low-memory XGBoost classifier predicting N2 light-sleep probability and coarse stages (NREM / REM / Wake).
- **Intelligent Smart Wake Engine**: Evaluates consecutive light-sleep epochs within a rolling wake window to trigger alarms at the optimal moment before a hard deadline.
- **Real-Time Clinical Dashboard**: React + Vite + TailwindCSS live monitoring interface with hypnogram charts, HRV telemetry dials, alarm state management, and an AI sleep assistant.
- **Dual-Storage Backend**: Redis for low-latency in-memory state and WebSocket synchronization; PostgreSQL + TimescaleDB for time-series persistence and historical trend analysis.

---

## 🏗️ System Architecture

```
                                  PHYSICAL LAYER
                        ┌─────────────────────────────────┐
                        │   AD8232 Single-Lead ECG Sensor │
                        └───────────────┬─────────────────┘
                                        │ Analog ECG Signal (3.3V)
                                        ▼
                        ┌─────────────────────────────────┐
                        │      ESP32 Microcontroller      │
                        │  - 250 Hz ADC Sampling          │
                        │  - Pan-Tompkins QRS Detector    │
                        │  - 30-Second RR Epoch Packager  │
                        └───────────────┬─────────────────┘
                                        │ MQTT over Wi-Fi (JSON)
                                        ▼
                                TRANSPORT & BROKER
                        ┌─────────────────────────────────┐
                        │    Eclipse Mosquitto (Broker)   │
                        │    Topic: somnus/rr/<device_id> │
                        └───────────────┬─────────────────┘
                                        │
                         BACKEND LAYER  ▼  (FastAPI Microservice)
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │ FastAPI Core Engine                                                         │
 │                                                                             │
 │   ┌───────────────────┐      ┌────────────────────┐      ┌───────────────┐  │
 │   │  MQTT Ingestor &  │ ───> │  HRV Feature Eng.  │ ───> │ ONNX Runtime  │  │
 │   │ Artifact Cleaner  │      │ (Time / Freq / NL) │      │  (XGBoost)    │  │
 │   └───────────────────┘      └────────────────────┘      └───────┬───────┘  │
 │                                                                  │          │
 │   ┌──────────────────────────────────────────────────────────────┘          │
 │   ▼                                                                         │
 │ ┌───────────────────┐         ┌───────────────────┐      ┌───────────────┐  │
 │ │  Smart Wake Logic │ ──────> │ WebSocket Gateway │      │   Database    │  │
 │ │ (K-Consecutive N2)│         │   & Event Bus     │      │   Manager     │  │
 │ └─────────┬─────────┘         └─────────┬─────────┘      └───────┬───────┘  │
 └───────────┼─────────────────────────────┼────────────────────────┼──────────┘
             │ MQTT Alarm Trigger          │ WebSockets             │ SQLAlchemy
             ▼                             ▼                        ▼
 ┌───────────────────────┐   ┌──────────────────────────┐   ┌──────────────────┐
 │ ESP32 Buzzer / Light  │   │ React Frontend Dashboard │   │ Redis (State)    │
 │ (Physical Wake Alarm) │   │ (Hypnogram & Live Telemetry)│ PostgreSQL +       │
 └───────────────────────┘   └──────────────────────────┘   │ TimescaleDB      │
                                                            └──────────────────┘
```
---

## 🔄 End-to-End Data Pipeline

1. **Acquisition (ESP32)**: The AD8232 analog signal is sampled at 250 Hz via hardware timer interrupts.
2. **Peak Detection**: On-device bandpass filtering, derivative squaring, and moving-window integration extract R-peaks and compute RR intervals (in ms).
3. **MQTT Publication**: At every 30-second epoch boundary, RR interval lists and artifact metrics are published to `somnus/rr/{device_id}`.
4. **Feature Extraction (Backend)**: The backend removes physiological outliers (ectopic beats) and computes 15+ standard HRV parameters.
5. **Inference**: An ONNX XGBoost model outputs $P(N2)$ (probability of light sleep) and stage labels.
6. **Smart Wake Decision**:
   $$\text{Trigger Alarm} \iff \sum_{i=0}^{K-1} \mathbb{I}\left(P(N2)_{t-i} \ge \Theta\right) = K \quad \text{AND} \quad t \in [T_{\text{target}} - W, T_{\text{target}}]$$
   *(Defaults: $\Theta = 0.70$, $K = 3\text{ epochs (90s)}$, $W = 30\text{ min}$, Force-wake at $T_{\text{target}}$).*
7. **Broadcast & Persistence**: Epoch details are stored in TimescaleDB and streamed to all connected WebSocket clients in `<50ms`.

---

## 🔌 Hardware & Pinout Setup

| AD8232 Pin | ESP32 Pin | Description |
|---|---|---|
| **3.3V** | `3V3` | Regulated 3.3V Power Supply |
| **GND** | `GND` | Common Ground |
| **OUTPUT** | `GPIO 36` (VP / ADC1_CH0) | Analog ECG Waveform Input |
| **LO+** | `GPIO 22` | Leads-Off Detection Positive |
| **LO-** | `GPIO 23` | Leads-Off Detection Negative |
| **SDN** | `N/C` (or 3.3V) | Shutdown Control (Active Low) |

> ⚠️ **Safety Note**: The AD8232 must strictly be powered via battery or an isolated power supply / USB isolator when connected to human subjects.

---

## 💻 Technology Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Edge Hardware** | ESP32 DevKit v1 + AD8232 | 250 Hz ECG signal sampling and edge processing |
| **Firmware** | C++ (PlatformIO / Arduino) | Pan-Tompkins QRS algorithm & MQTT streaming |
| **Messaging** | Eclipse Mosquitto (MQTT) | Low-latency binary/JSON epoch message transport |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | Async REST endpoints, MQTT consumers, and WebSocket servers |
| **ML Engine** | XGBoost + ONNX Runtime | High-throughput sleep stage inference |
| **Signal Analysis** | `NeuroKit2` + `hrv-analysis` | Medical-grade HRV feature extraction |
| **State Storage** | Redis 7 | In-memory session state, wake window queues, and live cache |
| **Timeseries DB** | PostgreSQL 16 + TimescaleDB | Persistent physiological epochs, hypnograms, and audit logs |
| **Frontend UI** | React 18 + Vite + TailwindCSS | Real-time monitoring dashboard, hypnogram, and alarm settings |
| **DevOps** | Docker Compose + Nginx | Multi-container local and production deployment |

---

## 📁 Repository Structure

```
SOMNUS-AI/
├── backend/                  # FastAPI REST, MQTT Consumer & WebSocket Engine
│   ├── app/
│   │   ├── api/              # HTTP Route Handlers (/health, /alarm, /epochs)
│   │   ├── core/             # Feature extraction, ONNX predictors, smart wake logic
│   │   ├── db/               # SQLAlchemy models, TimescaleDB schema & migrations
│   │   ├── models/           # ONNX models, feature columns, and approval manifests
│   │   └── services/         # MQTT, Redis, and WebSocket connection managers
│   ├── Dockerfile
│   └── requirements.txt
├── firmware/                 # ESP32 Firmware (PlatformIO Project)
│   ├── src/                  # Main loop, Pan-Tompkins filter, MQTT transmitter
│   ├── include/              # Pin configurations, filter constants & secrets templates
│   └── platformio.ini
├── frontend/                 # React Dashboard & Marketing Application
│   ├── src/
│   │   ├── components/       # Hypnogram, live gauges, alarm cards & chatbot
│   │   ├── pages/            # Live Dashboard, History, Settings & Marketing views
│   │   └── services/         # WebSocket & REST client adapters
│   ├── package.json
│   └── vite.config.ts
├── ml/                       # Machine Learning Training & Evaluation Pipeline
│   ├── src/
│   │   ├── datasets/         # SHHS, MESA, and ISRUC dataset loaders
│   │   ├── features.py       # Standardized feature engineering (matches backend)
│   │   └── train.py          # Model training, hyperparameter tuning & ONNX export
│   └── requirements.txt
├── infra/                    # Deployment configurations & mock utilities
│   ├── mosquitto/            # Mosquitto MQTT broker configuration & ACLs
│   ├── scripts/              # Mock ESP32 device simulator & credential generators
│   └── DEPLOY_LAN.md         # Production LAN demonstration runbook
├── docker-compose.yml        # Local development stack
├── docker-compose.production.yml # Isolated production stack
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Docker & Docker Compose](https://www.docker.com/)
- [Node.js 18+](https://nodejs.org/) (for local frontend development)
- [Python 3.11+](https://www.python.org/) (for local backend development)
- [PlatformIO](https://platformio.org/) (optional, for ESP32 flashing)

### 2. Clone the Repository
```bash
git clone https://github.com/GobsonJR/SOMNUS-AI.git
cd SOMNUS-AI
```

### 3. Launch Services with Docker Compose
Start the complete infrastructure (PostgreSQL/TimescaleDB, Redis, Mosquitto MQTT, FastAPI Backend, and Frontend):
```bash
docker compose up -d
```

### 4. Or Run Backend & Frontend Locally

#### Start Infrastructure Only:
```bash
docker compose up -d mosquitto redis postgres
```

#### Run Backend:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*Swagger API documentation will be live at `http://localhost:8000/docs`.*

#### Run Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend dashboard will be accessible at `http://localhost:5173`.*

### 5. Simulate Telemetry Without Hardware
If physical ESP32 hardware is not connected, use the built-in mock telemetry generator:
```bash
python infra/scripts/mock_esp32.py --device-id esp32_01 --interval 5
```

---

## 🔒 LAN Production Deployment

For clinical rehearsals or local demonstrations requiring authenticated hardware:

1. **Review Runbook**: Follow the detailed guide in [`infra/DEPLOY_LAN.md`](infra/DEPLOY_LAN.md).
2. **Set Secrets**: Copy `.env.production.example` to `.env.production` and generate secure tokens.
3. **Generate MQTT Passwords**:
   ```powershell
   ./infra/scripts/create-mqtt-passwordfile.ps1 -DevicePassword '<device-secret>' -BackendPassword '<backend-secret>'
   ```
4. **Flash ESP32**: Copy `firmware/include/secrets.example.h` to `firmware/include/secrets.h`, populate Wi-Fi/MQTT credentials, and upload firmware.
5. **Start Production Stack**:
   ```bash
   docker compose --env-file .env.production -f docker-compose.production.yml up --build -d
   ```

---

## 🤖 Machine Learning & Model Pipeline

Somnus uses a two-tier classification approach trained on polysomnography (PSG) recordings from **SHHS**, **MESA**, and **ISRUC-Sleep**:

1. **Light Sleep Specialist ($P(N2)$)**: Binary XGBoost classifier optimized for high precision on N2 stability transitions.
2. **Coarse Stage Classifier**: Multiclass model categorizing epochs into **NREM**, **REM**, and **Wake**.

### Training & Exporting Models
```bash
cd ml
pip install -r requirements.txt

# Run feature extraction and model training
python src/train.py --dataset mesa --epochs 50 --export-onnx ../backend/app/models/
```

---

## 📡 API & WebSocket Specifications

### REST Endpoints
- `GET /health` — Health check, database connectivity, and ML model approval status.
- `GET /api/v1/dashboard/summary` — Latest epoch, current stage, and active alarm metadata.
- `POST /api/v1/alarm/config` — Configure target wake time, window duration ($W$), and alarm modes.
- `GET /api/v1/epochs?limit=50` — Paginated historical sleep epochs and HRV metrics.

### WebSocket Stream (`/ws/live/{device_id}`)
Real-time JSON telemetry stream emitted every 30 seconds:
```json
{
  "type": "STAGE_UPDATE",
  "device_id": "esp32_01",
  "timestamp": "2026-08-27T21:00:00Z",
  "stage": "NREM",
  "n2_probability": 0.84,
  "alarm_status": "MONITORING",
  "features": {
    "mean_rr": 872.4,
    "rmssd": 42.1,
    "sdnn": 58.7,
    "lf_hf_ratio": 1.28
  }
}
```

---

## 👥 Contributors & Team

- **David Immanuel Gobson** — *Hardware Design & ESP32 Firmware Development*
- **Madhumanoj A** — *Hardware Integration & Sensor Validation*
- **B Praveen** — *Machine Learning Pipeline & Backend APIs*
- **Hariharasudhan A** — *Full-Stack Integration, Frontend Dashboard & Backend Wiring*

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

