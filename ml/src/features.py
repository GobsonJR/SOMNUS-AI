"""HRV feature extraction — must stay in sync with backend/app/core/feature_engine.py."""

from __future__ import annotations

import numpy as np
from hrvanalysis import (
    get_frequency_domain_features,
    get_poincare_plot_features,
    get_time_domain_features,
    remove_outliers,
)

FEATURE_COLUMNS = [
    "mean_rr",
    "sdnn",
    "rmssd",
    "pnn50",
    "median_rr",
    "min_rr",
    "max_rr",
    "lf",
    "hf",
    "lf_hf_ratio",
    "lfnu",
    "hfnu",
    "sd1",
    "sd2",
    "sd1_sd2_ratio",
]


def clean_rr_intervals(rr_intervals_ms: list[int | float]) -> list[float]:
    if len(rr_intervals_ms) < 2:
        return [float(x) for x in rr_intervals_ms]

    rr = [float(x) for x in rr_intervals_ms if 250 <= float(x) <= 2500]
    if len(rr) < 2:
        return rr

    try:
        cleaned = remove_outliers(rr_intervals=rr, low_rri=300, high_rri=2000, verbose=False)
        cleaned = [x for x in cleaned if x is not None]
        return cleaned if len(cleaned) >= 2 else rr
    except Exception:
        return rr


def extract_features(rr_intervals_ms: list[int | float]) -> dict[str, float] | None:
    rr = clean_rr_intervals(rr_intervals_ms)
    if len(rr) < 2:
        return None

    features: dict[str, float] = {}

    time_domain = get_time_domain_features(rr)
    for key in ("mean_rr", "sdnn", "rmssd", "pnn50", "median_rr", "min_rr", "max_rr"):
        value = time_domain.get(key)
        if value is not None and np.isfinite(value):
            features[key] = float(value)

    try:
        freq_domain = get_frequency_domain_features(rr, method="welch", sampling_frequency=4)
        for key in ("lf", "hf", "lf_hf_ratio", "lfnu", "hfnu"):
            value = freq_domain.get(key)
            if value is not None and np.isfinite(value):
                features[key] = float(value)
    except Exception:
        pass

    try:
        poincare = get_poincare_plot_features(rr)
        for key in ("sd1", "sd2", "sd1_sd2_ratio"):
            value = poincare.get(key)
            if value is not None and np.isfinite(value):
                features[key] = float(value)
    except Exception:
        pass

    if len(features) < 4:
        return None

    for col in FEATURE_COLUMNS:
        features.setdefault(col, 0.0)

    return features
