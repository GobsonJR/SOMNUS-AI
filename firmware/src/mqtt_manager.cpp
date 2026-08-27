#include "mqtt_manager.h"
#include <MQTT.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <time.h>

static WiFiClient wifiClient;
static MQTTClient mqttClient(512);
static std::function<void(const char*)> alarmCallback;

static String isoTimestamp(time_t now = time(nullptr)) {
    struct tm utc;
    gmtime_r(&now, &utc);
    char value[25];
    strftime(value, sizeof(value), "%Y-%m-%dT%H:%M:%SZ", &utc);
    return String(value);
}

static void publishAlarmEvent(const char* event, const char* wakeEventId, const char* reason) {
    StaticJsonDocument<384> doc;
    doc["protocol_version"] = "1.0";
    doc["message_id"] = String(DEVICE_ID) + "-event-" + String(millis());
    doc["device_id"] = DEVICE_ID;
    doc["sent_at"] = isoTimestamp();
    doc["wake_event_id"] = wakeEventId;
    doc["event"] = event;
    doc["reason"] = reason;
    char output[384];
    serializeJson(doc, output, sizeof(output));
    String topic = String("somnus/v1/devices/") + DEVICE_ID + "/events/alarm";
    mqttClient.publish(topic, output, false, 1);
}

static void onMqttMessage(String &topic, String &payload) {
    (void)topic;
    StaticJsonDocument<384> doc;
    if (deserializeJson(doc, payload)) return;
    const char* targetDevice = doc["device_id"] | "";
    const char* command = doc["command"] | "";
    if (String(targetDevice) != DEVICE_ID || String(command) != "WAKE") return;
    const char* wakeEventId = doc["wake_event_id"] | "";
    const char* reason = doc["reason"] | "N2_CONFIRMED";
    if (strlen(wakeEventId) == 0) {
        publishAlarmEvent("COMMAND_REJECTED", wakeEventId, reason);
        return;
    }
    publishAlarmEvent("ALARM_STARTED", wakeEventId, reason);
    if (alarmCallback) alarmCallback(reason);
    publishAlarmEvent("ALARM_STOPPED", wakeEventId, reason);
}

void initMqtt() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }

    configTime(UTC_OFFSET_SECONDS, 0, NTP_SERVER);
    mqttClient.begin(MQTT_BROKER, MQTT_PORT, wifiClient);
    mqttClient.onMessage(onMqttMessage);

    while (!mqttClient.connected()) {
        if (mqttClient.connect(DEVICE_ID, MQTT_USERNAME, MQTT_PASSWORD)) {
            String topic = String("somnus/v1/devices/") + DEVICE_ID + "/commands/alarm";
            mqttClient.subscribe(topic.c_str(), 1);
            publishDeviceStatus("ONLINE");
        } else {
            delay(2000);
        }
    }
}

void mqttLoop() {
    if (!mqttClient.connected()) {
        initMqtt();
    }
    mqttClient.loop();
}

void publishEpoch(const char* jsonPayload) {
    String topic = String("somnus/v1/devices/") + DEVICE_ID + "/telemetry/rr-epoch";
    mqttClient.publish(topic.c_str(), jsonPayload, false, 1);
}

void publishDeviceStatus(const char* state) {
    StaticJsonDocument<384> doc;
    doc["protocol_version"] = "1.0";
    doc["message_id"] = String(DEVICE_ID) + "-status-" + String(millis());
    doc["device_id"] = DEVICE_ID;
    doc["sent_at"] = isoTimestamp();
    doc["state"] = state;
    doc["firmware_version"] = "0.1.0";
    doc["wifi_rssi_dbm"] = WiFi.RSSI();
    doc["battery_pct"] = 100;
    char output[384];
    serializeJson(doc, output, sizeof(output));
    String topic = String("somnus/v1/devices/") + DEVICE_ID + "/status";
    mqttClient.publish(topic, output, true, 1);
}

void setAlarmCallback(std::function<void(const char* reason)> cb) {
    alarmCallback = cb;
}
