#include "ecg_sampler.h"

void initEcgSampler() {
    pinMode(ADC_PIN, INPUT);
    pinMode(LEAD_OFF_PLUS, INPUT);
    pinMode(LEAD_OFF_MINUS, INPUT);
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);
}

int readEcgSample() {
    return analogRead(ADC_PIN);
}

bool isLeadOff() {
    return digitalRead(LEAD_OFF_PLUS) == HIGH || digitalRead(LEAD_OFF_MINUS) == HIGH;
}
