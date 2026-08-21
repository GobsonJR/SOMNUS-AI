#pragma once

// Copy this file to config.h and set your WiFi + laptop IP.
// Arduino IDE: Sketch folder must contain config.h (not committed to git).

#define WIFI_SSID           "YOUR_WIFI_NAME"
#define WIFI_PASSWORD       "YOUR_WIFI_PASSWORD"

// IP address of the laptop running the Somnus backend (same WiFi as ESP32).
// Find it with: ipconfig  (look for IPv4 Address, e.g. 192.168.1.50)
#define BACKEND_HOST        "192.168.1.50"
#define BACKEND_PORT        8000

#define DEVICE_ID           "esp32_01"

// AD8232 + ESP32 wiring (default from FIRMWARE_README.md)
#define ADC_PIN             34
#define LEAD_OFF_PLUS       25
#define LEAD_OFF_MINUS      26
#define ALARM_BUZZER_PIN    18
#define ALARM_VIBRO_PIN     19

#define SAMPLING_RATE_HZ    250
#define EPOCH_DURATION_SEC  30

// R-peak detection tuning (adjust if peaks are missed on your AD8232)
#define PEAK_THRESHOLD      60
#define REFRACTORY_MS       300
