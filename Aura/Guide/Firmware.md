# Firmware — ESP32 ECG Firmware

> Located in `firmware/`. Built with **PlatformIO**.

---

## Hardware

- **MCU:** ESP32 DevKit (WiFi + BLE)
- **ECG Module:** AD8232 single-lead
- **Sampling:** 250 Hz via hardware timer
- **Output:** MQTT JSON payload every 30 seconds

---

## File Map

| File | Purpose |
|------|---------|
| `src/main.cpp` | Entry point, setup & loop |
| `src/ecg_sampler.cpp/.h` | ADC read + timer ISR |
| `src/pan_tompkins.cpp/.h` | QRS detection (R-peak timestamps) |
| `src/rr_buffer.cpp/.h` | Rolling 30-second RR interval buffer |
| `src/mqtt_manager.cpp/.h` | WiFi connection + MQTT publish/subscribe |
| `src/alarm_handler.cpp/.h` | Buzzer / vibration trigger on WAKE command |

---

## Data Flow (On-Device)

```
ECG electrode → AD8232 → ESP32 ADC (GPIO34)
   → Bandpass filter (5–15 Hz) → Pan–Tompkins QRS detector
   → R-peak timestamps → RR intervals (ms)
   → 30-second accumulation → MQTT JSON publish
```

---

## Build & Flash

```bash
cd firmware
pio run --target upload
pio device monitor
```

---

## MQTT Payload Format (30-second epoch)

```json
{
  "device_id": "esp32_01",
  "timestamp": 1718900000,
  "rr_intervals": [912, 905, 921, 898, 915, 902, ...],
  "r_peak_amplitudes": [1.21, 1.18, 1.22, ...],
  "sampling_rate": 250,
  "lead_off": false,
  "battery_pct": 84
}
```

---

## Alarm Command (Incoming from Backend)

Topic: `somnus/alarm/esp32_01`

```json
{
  "command": "WAKE",
  "reason": "N2_CONFIRMED",
  "timestamp": "2026-08-21T06:31:30Z"
}
```

On receipt, trigger buzzer + vibration motor for 10 seconds.

---

## Configuration (`include/config.h`)

```cpp
#define WIFI_SSID           "your-ssid"
#define WIFI_PASSWORD       "your-password"
#define MQTT_BROKER         "your-broker-ip"
#define MQTT_PORT           1883
#define DEVICE_ID           "esp32_01"
#define SAMPLING_RATE       250
#define EPOCH_DURATION_SEC  30
#define ADC_PIN             34
#define LEAD_OFF_PLUS       25
#define LEAD_OFF_MINUS      26
#define ALARM_BUZZER_PIN    18
#define ALARM_VIBRO_PIN     19
```
