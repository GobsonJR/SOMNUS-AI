# ML — Sleep Stage Training Pipeline

> Located in `ml/`. This is the **offline training environment**. It is not deployed to production; only its outputs (ONNX models + feature config) are copied to `backend/app/models/`.

---

## Goal

Train two XGBoost models on public sleep datasets that contain ECG + AASM labels:

1. **`model_n2.onnx`** — Binary classifier: N2 vs Non-N2 (for smart wake trigger)
2. **`model_stage.onnx`** — 3-class classifier: NREM / REM / Wake (for UI hypnogram)

---

## Directory Layout

```
ml/
├── README.md
├── requirements.txt
├── notebooks/
│   ├── 01_eda_shhs.ipynb
│   ├── 02_feature_importance.ipynb
│   └── 03_error_analysis.ipynb
├── data/
│   ├── raw/              # PhysioNet downloads (gitignored)
│   ├── interim/          # Cleaned RR intervals per recording
│   └── processed/        # Final CSV: one row = one 30s epoch
├── src/
│   ├── __init__.py
│   ├── dataset.py        # Load SHHS / MESA / ISRUC ECG + labels
│   ├── preprocess.py     # R-peak detection, RR cleaning, epoching
│   ├── features.py       # Feature extraction (MUST match backend!)
│   ├── train_xgboost.py  # Train both models
│   ├── evaluate.py       # Classification report, confusion matrix
│   └── export_onnx.py    # Convert to ONNX + feature_columns.json
├── configs/
│   └── xgboost_config.yaml
└── artifacts/            # Output models (copied to backend manually)
    ├── model_n2.onnx
    ├── model_stage.onnx
    └── feature_columns.json
```

---

## Recommended Datasets

| Dataset | Source | ECG Channel | AASM Labels |
|---------|--------|-------------|-------------|
| SHHS | PhysioNet | Yes | Yes |
| MESA | PhysioNet | Yes | Yes |
| ISRUC-Sleep | ISRUC | Yes | Yes |

Download via:
```bash
# Example: SHHS (requires PhysioNet credential file)
wfdb-python or requests to https://physionet.org/content/slpdb/
```

---

## Pipeline Steps

### 1. Preprocess (`src/preprocess.py`)

- Load ECG signal + sleep stage annotations
- Run **Pan–Tompkins** (same algorithm as ESP32 firmware) to detect R-peaks
- Compute RR intervals in ms
- **Clean RR:** remove ectopic beats (Kubios-style: differences > 20% of local median)
- Segment into 30-second epochs aligned with AASM labels

### 2. Feature Extraction (`src/features.py`)

Identical logic to `backend/app/core/feature_engine.py`:

```python
from hrvanalysis import (
    get_time_domain_features,
    get_frequency_domain_features,
    get_poincare_plot_features,
)

def extract_features(rr_intervals_ms):
    # Time-domain: mean_rr, sdnn, rmssd, pnn50, median_rr, min_rr, max_rr
    # Frequency-domain: lf, hf, lf_hf_ratio, lfnu, hfnu
    # Non-linear: sd1, sd2, sd1_sd2_ratio
    ...
```

### 3. Train (`src/train_xgboost.py`)

```python
import xgboost as xgb
from sklearn.model_selection import train_test_split

# N2 model (binary)
model_n2 = xgb.XGBClassifier(
    objective='binary:logistic',
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)
model_n2.fit(X_train, y_n2_train)

# Stage model (3-class)
model_stage = xgb.XGBClassifier(
    objective='multi:softprob',
    num_class=3,
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    random_state=42
)
model_stage.fit(X_train, y_stage_train)
```

### 4. Evaluate (`src/evaluate.py`)

Outputs:
- Classification report (precision, recall, f1 per class)
- Confusion matrix
- Feature importance plot (top 20)

### 5. Export (`src/export_onnx.py`)

```python
import skl2onnx
from skl2onnx.common.data_types import FloatTensorType

initial_type = [('float_input', FloatTensorType([None, len(FEATURE_COLS)]))]

onnx_n2 = convert_xgboost(model_n2, initial_types=initial_type)
with open("artifacts/model_n2.onnx", "wb") as f:
    f.write(onnx_n2.SerializeToString())

onnx_stage = convert_xgboost(model_stage, initial_types=initial_type)
with open("artifacts/model_stage.onnx", "wb") as f:
    f.write(onnx_stage.SerializeToString())

# Also export column order
import json
with open("artifacts/feature_columns.json", "w") as f:
    json.dump(FEATURE_COLS, f)
```

---

## Copy to Backend

After training and evaluation, manually copy artifacts:

```bash
cp ml/artifacts/*.onnx ml/artifacts/feature_columns.json backend/app/models/
```

---

## Run Full Pipeline

```bash
cd ml
pip install -r requirements.txt

# 1. Download & preprocess
python src/preprocess.py --dataset shhs --output data/interim/

# 2. Build feature CSV
python src/features.py --input data/interim/ --output data/processed/epochs.csv

# 3. Train
python src/train_xgboost.py --input data/processed/epochs.csv --output artifacts/

# 4. Evaluate
python src/evaluate.py --model artifacts/model_n2.onnx --test data/processed/test.csv

# 5. Export
python src/export_onnx.py --models artifacts/ --output artifacts/
```
