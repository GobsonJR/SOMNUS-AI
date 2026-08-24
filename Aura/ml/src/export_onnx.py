"""Export trained XGBoost models to ONNX."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

from features import FEATURE_COLUMNS


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--models", default="artifacts", help="Directory with joblib models")
    parser.add_argument("--output", default="artifacts", help="Output directory for ONNX")
    args = parser.parse_args()

    models_dir = Path(args.models)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    initial_type = [("float_input", FloatTensorType([None, len(FEATURE_COLUMNS)]))]

    for name in ("model_n2", "model_stage"):
        model = joblib.load(models_dir / f"{name}.joblib")
        onnx_model = convert_sklearn(model, initial_types=initial_type)
        (output_dir / f"{name}.onnx").write_bytes(onnx_model.SerializeToString())

    (output_dir / "feature_columns.json").write_text(json.dumps(FEATURE_COLUMNS, indent=2))
    print(f"Exported ONNX models to {output_dir}")


if __name__ == "__main__":
    main()
