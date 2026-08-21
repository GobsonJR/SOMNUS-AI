"""Build synthetic epoch CSV for pipeline testing when real datasets are unavailable."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd

from features import FEATURE_COLUMNS


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="data/processed/epochs.csv")
    parser.add_argument("--rows", type=int, default=1000)
    args = parser.parse_args()

    rng = np.random.default_rng(42)
    rows = []
    for _ in range(args.rows):
        features = {col: float(rng.normal()) for col in FEATURE_COLUMNS}
        label_n2 = int(features["rmssd"] > 0)
        label_stage = int(rng.integers(0, 3))
        rows.append({**features, "label_n2": label_n2, "label_stage": label_stage})

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(rows).to_csv(out, index=False)
    print(f"Wrote {args.rows} synthetic epochs to {out}")


if __name__ == "__main__":
    main()
