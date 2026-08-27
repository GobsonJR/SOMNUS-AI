#include <Arduino.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include <time.h>
#include "config.h"
#include "ecg_sampler.h"
#include "http_uploader.h"
#include "pan_tompkins.h"
#include "rr_buffer.h"

PanTompkins detector(PEAK_THRESHOLD, REFRACTORY_MS);
RrBuffer rrBuffer;

unsigned long epochStartMs = 0;
unsigned int sequence = 0;
static const unsigned long SAMPLE_PERIOD_US = 1000000UL / SAMPLING_RATE;
static unsigned long lastSampleUs = 0;

static String isoTimestamp(time_t now = time(nullptr)) {
    struct tm utc;
    gmtime_r(&now, &utc);
    char value[25];
    strftime(value, sizeof(value), "%Y-%m-%dT%H:%M:%SZ", &utc);
    return String(value);
}

static void connectWiFi() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
    configTime(UTC_OFFSET_SECONDS, 0, NTP_SERVER);
}

void setup() {
    Serial.begin(115200);
    initEcgSampler();
    connectWiFi();
    epochStartMs = millis();
    lastSampleUs = micros();
    Serial.printf("Somnus firmware HTTP -> http://%s:%d\n", BACKEND_HOST, BACKEND_PORT);
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        connectWiFi();
    }

    unsigned long nowUs = micros();
    if (nowUs - lastSampleUs >= SAMPLE_PERIOD_US) {
        lastSampleUs += SAMPLE_PERIOD_US;
        int sample = readEcgSample();
        unsigned int rrMs = 0;
        if (!isLeadOff() && detector.processSample(sample, millis(), rrMs)) {
            rrBuffer.addInterval(rrMs);
        }
    }

    if (millis() - epochStartMs >= (unsigned long)EPOCH_DURATION_SEC * 1000UL) {
        bool synced = time(nullptr) > 1700000000;
        StaticJsonDocument<3072> doc;
        doc["protocol_version"] = "1.0";
        doc["message_id"] = String(DEVICE_ID) + "-" + String(sequence) + "-" + String(millis());
        doc["device_id"] = DEVICE_ID;
        doc["sent_at"] = synced ? isoTimestamp() : "1970-01-01T00:00:00Z";
        doc["epoch_started_at"] = synced ? isoTimestamp(time(nullptr) - EPOCH_DURATION_SEC) : "1970-01-01T00:00:00Z";
        doc["epoch_duration_ms"] = 30000;
        doc["sequence"] = sequence++;
        doc["sampling_rate_hz"] = SAMPLING_RATE;
        doc["lead_off"] = isLeadOff();
        doc["battery_pct"] = 100;
        doc["clock_synced"] = synced;

        JsonArray rr = doc["rr_intervals_ms"].to<JsonArray>();
        for (unsigned int v : rrBuffer.snapshot()) {
            rr.add(v);
        }
        JsonObject quality = doc["signal_quality"].to<JsonObject>();
        quality["accepted_beats"] = rr.size();
        quality["rejected_candidates"] = 0;

        char payload[3072];
        serializeJson(doc, payload, sizeof(payload));

        String response;
        if (uploadEpochHttp(payload, response)) {
            Serial.printf("Epoch uploaded (%u RR): %s\n", rr.size(), response.c_str());
        } else {
            Serial.printf("Upload failed: %s\n", response.c_str());
        }

        rrBuffer.clear();
        epochStartMs = millis();
    }
}
