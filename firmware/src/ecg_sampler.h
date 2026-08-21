#pragma once

#include "config.h"
#include <Arduino.h>

void initEcgSampler();
int readEcgSample();
bool isLeadOff();
