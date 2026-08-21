"""ONNX inference wrapper. No synthetic prediction is ever returned."""

from __future__ import annotations

import json
import logging
from pathlib import Path

import numpy as np

from app.core.feature_engine import FEATURE_COLUMNS, features_to_vector

logger = logging.getLogger(__name__)

STAGE_LABELS = ["NREM", "REM", "Wake"]


class Predictor:
    def __init__(self, n2_path: str, stage_path: str, feature_columns_path: str) -> None:
        self.feature_columns = FEATURE_COLUMNS
        self._n2_session = None
        self._stage_session = None

        columns_path = Path(feature_columns_path)
        if columns_path.exists():
            self.feature_columns = json.loads(columns_path.read_text())

        try:
            import onnxruntime as ort

            n2_file = Path(n2_path)
            stage_file = Path(stage_path)
            if n2_file.exists():
                self._n2_session = ort.InferenceSession(str(n2_file))
            if stage_file.exists():
                self._stage_session = ort.InferenceSession(str(stage_file))
        except Exception as exc:
            logger.error("ONNX runtime/model loading failed: %s", exc)

    @property
    def is_ready(self) -> bool:
        return self._n2_session is not None and self._stage_session is not None

    def predict(self, features: dict[str, float]) -> dict[str, float | str]:
        if not self.is_ready:
            raise RuntimeError("MODEL_NOT_APPROVED")
        vector = np.array([features_to_vector(features, self.feature_columns)], dtype=np.float32)
        n2_prob = float(self._n2_session.run(None, {"float_input": vector})[1][0][1])
        probs = self._stage_session.run(None, {"float_input": vector})[1][0]
        stage_idx = int(np.argmax(probs))
        stage = STAGE_LABELS[stage_idx] if stage_idx < len(STAGE_LABELS) else "NREM"

        return {"n2_probability": round(n2_prob, 4), "stage": stage}
