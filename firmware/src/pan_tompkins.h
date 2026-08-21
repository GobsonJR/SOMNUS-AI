#pragma once

class PanTompkins {
public:
    explicit PanTompkins(int threshold = 60, int refractoryMs = 300);

    bool processSample(int sample, unsigned long timestampMs, unsigned int& rrOut);
    void reset();

private:
    static const int BASELINE_LEN = 64;
    int baselineRing_[BASELINE_LEN]{};
    int baselineIdx_ = 0;
    long baselineSum_ = 0;
    bool baselineReady_ = false;
    int prevFiltered_ = 0;
    bool risingArm_ = false;
    unsigned long lastPeakMs_ = 0;
    int threshold_;
    int refractoryMs_;
};
