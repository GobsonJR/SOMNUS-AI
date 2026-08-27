#pragma once

#include <vector>

class RrBuffer {
public:
    void addInterval(unsigned int rrMs);
    std::vector<unsigned int> snapshot() const;
    void clear();
    bool isEpochReady(unsigned long epochStartMs) const;

private:
    std::vector<unsigned int> intervals_;
};
