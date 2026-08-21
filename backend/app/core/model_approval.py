"""Validate model artifacts before allowing automatic physical wake commands."""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ModelApproval:
    approved: bool
    reason: str
    version: str | None = None


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_model_artifacts(
    n2_path: str,
    stage_path: str,
    feature_columns_path: str,
    manifest_path: str,
    *,
    min_n2_f1: float,
    min_n2_recall: float,
) -> ModelApproval:
    paths = {
        "n2_sha256": Path(n2_path),
        "stage_sha256": Path(stage_path),
        "feature_columns_sha256": Path(feature_columns_path),
    }
    manifest_file = Path(manifest_path)
    if not manifest_file.exists():
        return ModelApproval(False, "MODEL_MANIFEST_MISSING")
    if any(not path.exists() for path in paths.values()):
        return ModelApproval(False, "MODEL_ARTIFACT_MISSING")
    try:
        manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return ModelApproval(False, "MODEL_MANIFEST_INVALID")

    validation = manifest.get("validation", {})
    if not validation.get("approved", False):
        return ModelApproval(False, "MODEL_NOT_APPROVED", manifest.get("model_version"))
    if float(validation.get("n2_f1", 0)) < min_n2_f1 or float(validation.get("n2_recall", 0)) < min_n2_recall:
        return ModelApproval(False, "MODEL_METRICS_BELOW_THRESHOLD", manifest.get("model_version"))
    for field, path in paths.items():
        if manifest.get(field) != _sha256(path):
            return ModelApproval(False, "MODEL_HASH_MISMATCH", manifest.get("model_version"))
    return ModelApproval(True, "APPROVED", manifest.get("model_version"))
