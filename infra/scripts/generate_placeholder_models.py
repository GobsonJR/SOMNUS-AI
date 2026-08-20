"""Generate dev ONNX models so the backend can run real inference locally."""

from pathlib import Path

import numpy as np
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
from sklearn.ensemble import RandomForestClassifier

FEATURE_COLS = [
    "mean_rr", "sdnn", "rmssd", "pnn50", "median_rr", "min_rr", "max_rr",
    "lf", "hf", "lf_hf_ratio", "lfnu", "hfnu", "sd1", "sd2", "sd1_sd2_ratio",
]

N_FEATURES = len(FEATURE_COLS)
rng = np.random.default_rng(42)
X = rng.normal(size=(200, N_FEATURES))
y_n2 = (X[:, 2] > 0).astype(int)
y_stage = rng.integers(0, 3, size=200)

initial_type = [("float_input", FloatTensorType([None, N_FEATURES]))]

n2_model = RandomForestClassifier(n_estimators=10, random_state=42)
n2_model.fit(X, y_n2)
n2_onnx = convert_sklearn(n2_model, initial_types=initial_type)

stage_model = RandomForestClassifier(n_estimators=10, random_state=42)
stage_model.fit(X, y_stage)
stage_onnx = convert_sklearn(stage_model, initial_types=initial_type)

for out_dir in (Path("backend/app/models"), Path("ml/artifacts")):
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "model_n2.onnx").write_bytes(n2_onnx.SerializeToString())
    (out_dir / "model_stage.onnx").write_bytes(stage_onnx.SerializeToString())
    (out_dir / "feature_columns.json").write_text(
        __import__("json").dumps(FEATURE_COLS, indent=2), encoding="utf-8"
    )
    print(f"Wrote ONNX models to {out_dir}")
