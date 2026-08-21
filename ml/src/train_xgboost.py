"""Train XGBoost models for N2 binary and 3-class stage classification."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import pandas as pd
import xgboost as xgb
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

from features import FEATURE_COLUMNS


def load_data(path: Path) -> tuple[pd.DataFrame, pd.Series, pd.Series]:
    df = pd.read_csv(path)
    X = df[FEATURE_COLUMNS].fillna(0.0)
    y_n2 = df["label_n2"]
    y_stage = df["label_stage"]
    return X, y_n2, y_stage


def train_models(X_train, y_n2_train, y_stage_train):
    model_n2 = xgb.XGBClassifier(
        objective="binary:logistic",
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
    )
    model_n2.fit(X_train, y_n2_train)

    model_stage = xgb.XGBClassifier(
        objective="multi:softprob",
        num_class=3,
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
    )
    model_stage.fit(X_train, y_stage_train)
    return model_n2, model_stage


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to processed epochs CSV")
    parser.add_argument("--output", default="artifacts", help="Output directory")
    args = parser.parse_args()

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    X, y_n2, y_stage = load_data(Path(args.input))
    X_train, X_test, yn2_train, yn2_test, ys_train, ys_test = train_test_split(
        X, y_n2, y_stage, test_size=0.2, random_state=42, stratify=y_n2
    )

    model_n2, model_stage = train_models(X_train, yn2_train, ys_train)

    print("N2 classifier:")
    print(classification_report(yn2_test, model_n2.predict(X_test)))
    print(confusion_matrix(yn2_test, model_n2.predict(X_test)))

    print("Stage classifier:")
    print(classification_report(ys_test, model_stage.predict(X_test)))
    print(confusion_matrix(ys_test, model_stage.predict(X_test)))

    import joblib

    joblib.dump(model_n2, output_dir / "model_n2.joblib")
    joblib.dump(model_stage, output_dir / "model_stage.joblib")
    (output_dir / "feature_columns.json").write_text(json.dumps(FEATURE_COLUMNS, indent=2))
    print(f"Saved joblib models to {output_dir}")


if __name__ == "__main__":
    main()
