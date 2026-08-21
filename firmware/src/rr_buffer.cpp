#include "rr_buffer.h"

void RrBuffer::addInterval(unsigned int rrMs) {
    intervals_.push_back(rrMs);
}

std::vector<unsigned int> RrBuffer::snapshot() const {
    return intervals_;
}

void RrBuffer::clear() {
    intervals_.clear();
}

bool RrBuffer::isEpochReady(unsigned long epochStartMs) const {
    (void)epochStartMs;
    return intervals_.size() >= 2;
}
