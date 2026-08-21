#include "pan_tompkins.h"
#include <Arduino.h>

PanTompkins::PanTompkins(int threshold, int refractoryMs)
    : threshold_(threshold), refractoryMs_(refractoryMs) {}

bool PanTompkins::processSample(int raw, unsigned long timestampMs, unsigned int& rrOut) {
    baselineSum_ -= baselineRing_[baselineIdx_];
    baselineRing_[baselineIdx_] = raw;
    baselineSum_ += raw;
    baselineIdx_ = (baselineIdx_ + 1) % BASELINE_LEN;
    if (!baselineReady_ && baselineIdx_ == 0) {
        baselineReady_ = true;
    }
    if (!baselineReady_) {
        return false;
    }

    int filtered = raw - static_cast<int>(baselineSum_ / BASELINE_LEN);

    if (filtered > threshold_ && filtered >= prevFiltered_) {
        risingArm_ = true;
    }
    if (risingArm_ && filtered < prevFiltered_ && filtered > (threshold_ / 2)) {
        risingArm_ = false;
        if (lastPeakMs_ > 0) {
            unsigned long rr = timestampMs - lastPeakMs_;
            if (rr >= static_cast<unsigned>(refractoryMs_) && rr <= 2500) {
                rrOut = rr;
                lastPeakMs_ = timestampMs;
                prevFiltered_ = filtered;
                return true;
            }
        }
        lastPeakMs_ = timestampMs;
    }
    prevFiltered_ = filtered;
    return false;
}

void PanTompkins::reset() {
    lastPeakMs_ = 0;
    prevFiltered_ = 0;
    risingArm_ = false;
    baselineIdx_ = 0;
    baselineSum_ = 0;
    baselineReady_ = false;
}
