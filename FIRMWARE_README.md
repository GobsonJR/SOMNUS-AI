# Firmware — ESP32 ECG (Arduino IDE recommended)

> **Use `arduino/somnus_esp32/` for Arduino IDE.** This PlatformIO project mirrors the same HTTP upload path.

---

## Arduino IDE (primary)

See **[arduino/README.md](../arduino/README.md)** for full wiring, `config.h`, and step-by-step upload.

Summary:
1. AD8232 → GPIO 34, LO+/LO- → GPIO 25/26
2. ESP32 joins your WiFi
3. Every 30s: real RR intervals POST to `http://<laptop-ip>:8000/api/v1/devices/esp32_01/telemetry/rr-epoch`
4. Backend runs HRV + ONNX → N2 probability → dashboard WebSocket

---

## PlatformIO (optional)

```bash
cd firmware
cp include/secrets.example.h include/secrets.h   # set WiFi + BACKEND_HOST
pio run --target upload
pio device monitor
```

---

## Data flow

```
AD8232 ECG → ESP32 ADC @ 250 Hz → baseline filter → R-peak → RR ms
→ 30 s epoch JSON → HTTP POST → FastAPI ingestor → ML → WebSocket → dashboard
```

Serial monitor prints HTTP status and backend ML JSON — not a substitute for the server pipeline.
