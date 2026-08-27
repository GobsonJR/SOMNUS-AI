/*
 * Somnus ESP32 — AD8232 ECG → RR intervals → Somnus backend (HTTP)
 *
 * Open this folder in Arduino IDE (File → Open → somnus_esp32.ino).
 * Install library: ArduinoJson by Benoit Blanchon (v7+).
 * Board: ESP32 Dev Module. Copy config.example.h → config.h and edit WiFi/backend IP.
 *
 * Data flow:
 *   AD8232 analog → R-peak detection → 30s RR buffer → POST JSON to FastAPI
 *   Backend runs HRV features + ONNX model → N2 vs non-N2 → WebSocket dashboard
 *
 * Serial monitor shows connection status and backend ML response (not fake data).
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <time.h>

#include "config.h"

#ifndef BACKEND_HOST
#error "Copy config.example.h to config.h and set WIFI_SSID, BACKEND_HOST, etc."
#endif

// ---- ECG / RR state ----
static const unsigned long SAMPLE_PERIOD_US = 1000000UL / SAMPLING_RATE_HZ;
static unsigned long lastSampleUs = 0;
static unsigned long epochStartMs = 0;
static unsigned long sequence = 0;

static const size_t MAX_RR = 80;
static uint16_t rrIntervals[MAX_RR];
static size_t rrCount = 0;
static uint16_t acceptedBeats = 0;
static uint16_t rejectedCandidates = 0;

// Baseline removal (moving average)
static const int BASELINE_LEN = 64;
static int baselineRing[BASELINE_LEN];
static int baselineIdx = 0;
static long baselineSum = 0;
static bool baselineReady = false;

// Peak detector state
static int prevFiltered = 0;
static bool risingArm = false;
static unsigned long lastPeakMs = 0;

static bool clockSynced = false;

static int baselineAverage() {
  return baselineReady ? (int)(baselineSum / BASELINE_LEN) : 0;
}

static int filterSample(int raw) {
  baselineSum -= baselineRing[baselineIdx];
  baselineRing[baselineIdx] = raw;
  baselineSum += raw;
  baselineIdx = (baselineIdx + 1) % BASELINE_LEN;
  if (!baselineReady && baselineIdx == 0) {
    baselineReady = true;
  }
  return raw - baselineAverage();
}

static bool detectPeak(int filtered, unsigned long nowMs, uint16_t& rrOut) {
  if (!baselineReady) {
    return false;
  }

  if (filtered > PEAK_THRESHOLD && filtered >= prevFiltered) {
    risingArm = true;
  }

  if (risingArm && filtered < prevFiltered && filtered > (PEAK_THRESHOLD / 2)) {
    risingArm = false;
    if (lastPeakMs > 0) {
      unsigned long rr = nowMs - lastPeakMs;
      if (rr >= REFRACTORY_MS && rr <= 2500) {
        rrOut = (uint16_t)rr;
        lastPeakMs = nowMs;
        prevFiltered = filtered;
        return true;
      }
      if (rr < REFRACTORY_MS) {
        rejectedCandidates++;
      }
    }
    lastPeakMs = nowMs;
  }

  prevFiltered = filtered;
  return false;
}

static bool readLeadOff() {
  return digitalRead(LEAD_OFF_PLUS) == HIGH || digitalRead(LEAD_OFF_MINUS) == HIGH;
}

static String isoUtc(time_t t) {
  struct tm utc;
  gmtime_r(&t, &utc);
  char buf[25];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &utc);
  return String(buf);
}

static void connectWiFi() {
  Serial.printf("[WiFi] Connecting to %s ...\n", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 60) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  Serial.println();
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] FAILED — check SSID/password in config.h");
    return;
  }
  Serial.printf("[WiFi] Connected. ESP32 IP: %s  RSSI: %d dBm\n",
                WiFi.localIP().toString().c_str(), WiFi.RSSI());
}

static void syncClock() {
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  for (int i = 0; i < 30; i++) {
    if (time(nullptr) > 1700000000) {
      clockSynced = true;
      Serial.printf("[NTP] Clock synced: %s\n", isoUtc(time(nullptr)).c_str());
      return;
    }
    delay(500);
  }
  clockSynced = false;
  Serial.println("[NTP] Not synced — backend will still run ML, smart wake deadline disabled.");
}

static bool postEpochToBackend(const char* jsonPayload, String& responseBody) {
  WiFiClient client;
  HTTPClient http;
  String url = String("http://") + BACKEND_HOST + ":" + String(BACKEND_PORT)
               + "/api/v1/devices/" + DEVICE_ID + "/telemetry/rr-epoch";

  http.setTimeout(15000);
  if (!http.begin(client, url)) {
    Serial.println("[HTTP] begin() failed");
    return false;
  }
  http.addHeader("Content-Type", "application/json");

  int code = http.POST(jsonPayload);
  responseBody = http.getString();
  http.end();

  Serial.printf("[HTTP] POST %s -> %d\n", url.c_str(), code);
  if (code <= 0) {
    Serial.printf("[HTTP] Error: %s\n", http.errorToString(code).c_str());
    return false;
  }
  return code >= 200 && code < 300;
}

static void publishEpoch() {
  bool leadOff = readLeadOff();
  time_t nowSec = time(nullptr);
  time_t epochStartSec = clockSynced ? (nowSec - EPOCH_DURATION_SEC) : 0;

  StaticJsonDocument<3072> doc;
  doc["protocol_version"] = "1.0";
  doc["message_id"] = String(DEVICE_ID) + "-" + String(sequence) + "-" + String(millis());
  doc["device_id"] = DEVICE_ID;
  doc["sent_at"] = clockSynced ? isoUtc(nowSec) : "1970-01-01T00:00:00Z";
  doc["epoch_started_at"] = clockSynced ? isoUtc(epochStartSec) : "1970-01-01T00:00:00Z";
  doc["epoch_duration_ms"] = 30000;
  doc["sequence"] = sequence++;
  doc["sampling_rate_hz"] = SAMPLING_RATE_HZ;
  doc["lead_off"] = leadOff;
  doc["battery_pct"] = 100;
  doc["clock_synced"] = clockSynced;

  JsonArray rr = doc["rr_intervals_ms"].to<JsonArray>();
  for (size_t i = 0; i < rrCount; i++) {
    rr.add(rrIntervals[i]);
  }

  JsonObject quality = doc["signal_quality"].to<JsonObject>();
  quality["accepted_beats"] = acceptedBeats;
  quality["rejected_candidates"] = rejectedCandidates;

  char payload[3072];
  size_t len = serializeJson(doc, payload, sizeof(payload));
  if (len >= sizeof(payload)) {
    Serial.println("[ERR] JSON payload too large");
    return;
  }

  Serial.printf("[Epoch] seq=%lu rr=%u lead_off=%s\n",
                (unsigned long)(sequence - 1), (unsigned)rrCount, leadOff ? "yes" : "no");

  String response;
  if (postEpochToBackend(payload, response)) {
    Serial.println("[Backend] " + response);

    StaticJsonDocument<768> parsed;
    if (!deserializeJson(parsed, response)) {
      if (parsed["n2_probability"].is<float>()) {
        Serial.printf("[ML] stage=%s n2=%.2f is_n2=%s\n",
                      parsed["stage"] | "?",
                      parsed["n2_probability"].as<float>(),
                      parsed["is_n2"].as<bool>() ? "yes" : "no");
      } else if (parsed["inference"].is<const char*>()) {
        Serial.printf("[ML] inference skipped: %s\n", parsed["inference"] | "?");
      }
    }
  } else {
    Serial.println("[Backend] Upload failed — is uvicorn running on " BACKEND_HOST "?");
    Serial.println(response);
  }

  rrCount = 0;
  acceptedBeats = 0;
  rejectedCandidates = 0;
  epochStartMs = millis();
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println();
  Serial.println("=== Somnus ESP32 ECG → Backend ===");

  pinMode(ADC_PIN, INPUT);
  pinMode(LEAD_OFF_PLUS, INPUT);
  pinMode(LEAD_OFF_MINUS, INPUT);
  pinMode(ALARM_BUZZER_PIN, OUTPUT);
  pinMode(ALARM_VIBRO_PIN, OUTPUT);
  digitalWrite(ALARM_BUZZER_PIN, LOW);
  digitalWrite(ALARM_VIBRO_PIN, LOW);
  analogReadResolution(12);

  connectWiFi();
  syncClock();

  epochStartMs = millis();
  lastSampleUs = micros();
  Serial.printf("[ECG] Sampling AD8232 on GPIO%d at %d Hz\n", ADC_PIN, SAMPLING_RATE_HZ);
  Serial.printf("[ECG] Posting to http://%s:%d every %d s\n", BACKEND_HOST, BACKEND_PORT, EPOCH_DURATION_SEC);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  unsigned long nowUs = micros();
  if (nowUs - lastSampleUs >= SAMPLE_PERIOD_US) {
    lastSampleUs += SAMPLE_PERIOD_US;

    int raw = analogRead(ADC_PIN);
    int filtered = filterSample(raw);
    unsigned long nowMs = millis();

    uint16_t rrMs = 0;
    if (!readLeadOff() && detectPeak(filtered, nowMs, rrMs)) {
      if (rrCount < MAX_RR) {
        rrIntervals[rrCount++] = rrMs;
        acceptedBeats++;
      }
    }
  }

  if (millis() - epochStartMs >= (unsigned long)EPOCH_DURATION_SEC * 1000UL) {
    publishEpoch();
  }
}
