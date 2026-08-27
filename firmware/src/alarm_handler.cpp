#include "alarm_handler.h"
#include <Arduino.h>
#include "config.h"

void initAlarmHandler() {
    pinMode(ALARM_BUZZER_PIN, OUTPUT);
    pinMode(ALARM_VIBRO_PIN, OUTPUT);
    digitalWrite(ALARM_BUZZER_PIN, LOW);
    digitalWrite(ALARM_VIBRO_PIN, LOW);
}

void triggerAlarm(const char* reason, int durationSec) {
    (void)reason;
    digitalWrite(ALARM_BUZZER_PIN, HIGH);
    digitalWrite(ALARM_VIBRO_PIN, HIGH);
    delay(durationSec * 1000);
    digitalWrite(ALARM_BUZZER_PIN, LOW);
    digitalWrite(ALARM_VIBRO_PIN, LOW);
}
