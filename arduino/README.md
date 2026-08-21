# ESP32 firmware for Arduino IDE

This is the **primary firmware path** for Somnus. It reads real AD8232 ECG, detects R-peaks, builds 30-second RR epochs, and **POSTs JSON to the Somnus backend over WiFi** for ML (N2 vs non-N2).

Serial monitor shows WiFi status, HTTP result, and the backend ML response. It does **not** replace the backend — all sleep staging runs server-side.

## Hardware

| AD8232 | ESP32 |
|--------|-------|
| OUTPUT | GPIO 34 (ADC) |
| LO+    | GPIO 25 |
| LO-    | GPIO 26 |
| 3.3V   | 3.3V |
| GND    | GND |

Optional: buzzer GPIO 18, vibration GPIO 19.

## Arduino IDE setup

1. Install **ESP32 board support** (Board Manager → esp32 by Espressif).
2. Install library **ArduinoJson** v7 (Library Manager).
3. Copy `config.example.h` → `config.h`.
4. Edit `config.h`:
   - `WIFI_SSID` / `WIFI_PASSWORD` — your home/lab WiFi (ESP32 and laptop on **same network**).
   - `BACKEND_HOST` — your laptop IPv4 (`ipconfig` on Windows → e.g. `192.168.1.50`).
   - `DEVICE_ID` — must match backend `CONFIGURED_DEVICE_ID` (default `esp32_01`).
5. Board: **ESP32 Dev Module**, Upload speed 921600, Port: your COM port.
6. Open `somnus_esp32.ino` and Upload.

## Backend on your laptop (same WiFi)

```powershell
cd d:\Somnus
docker compose up -d postgres redis

cd backend
pip install -r requirements.txt
pip install scikit-learn skl2onnx onnxruntime
python ..\infra\scripts\generate_placeholder_models.py
copy ..\.env.example ..\.env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Allow port **8000** in Windows Firewall for **Private** networks so the ESP32 can reach your laptop.

Check readiness: `http://127.0.0.1:8000/ready` — should show `onnx_models: true`.

## Expected Serial output

```
[WiFi] Connected. ESP32 IP: 192.168.1.42
[NTP] Clock synced: 2026-08-20T16:30:00Z
[ECG] Sampling AD8232 on GPIO34 at 250 Hz
[Epoch] seq=0 rr=32 lead_off=no
[HTTP] POST http://192.168.1.50:8000/api/v1/devices/esp32_01/telemetry/rr-epoch -> 200
[ML] stage=NREM n2=0.73 is_n2=yes
```

## Dashboard

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/dashboard` — live updates via WebSocket when epochs arrive.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `HTTP POST -> -1` | Wrong `BACKEND_HOST`, firewall, or backend not on `0.0.0.0:8000` |
| `rr=0` | Check electrode contact; lower `PEAK_THRESHOLD` in config.h |
| `lead_off=yes` | Re-seat electrode pads; LO+ / LO- wiring |
| `onnx_models_missing` | Run `generate_placeholder_models.py` |
| `422 invalid_payload` | Need ≥2 RR intervals per epoch; wear sensor 30+ seconds |

## MQTT (optional)

HTTP is enough for ML. PlatformIO firmware in `firmware/` also supports MQTT for production LAN deploy — see `infra/DEPLOY_LAN.md`.
