#include "http_uploader.h"
#include "config.h"
#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClient.h>

bool uploadEpochHttp(const char* jsonPayload, String& responseBody) {
    WiFiClient client;
    HTTPClient http;
    String url = String("http://") + BACKEND_HOST + ":" + String(BACKEND_PORT)
                 + "/api/v1/devices/" + DEVICE_ID + "/telemetry/rr-epoch";
    http.setTimeout(15000);
    if (!http.begin(client, url)) {
        return false;
    }
    http.addHeader("Content-Type", "application/json");
    int code = http.POST(jsonPayload);
    responseBody = http.getString();
    http.end();
    return code >= 200 && code < 300;
}
