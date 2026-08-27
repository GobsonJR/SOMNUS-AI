#pragma once

#include "config.h"
#include <functional>

void initMqtt();
void mqttLoop();
void publishEpoch(const char* jsonPayload);
void publishDeviceStatus(const char* state);
void setAlarmCallback(std::function<void(const char* reason)> cb);
