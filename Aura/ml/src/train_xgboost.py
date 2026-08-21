import pandas as pd
import numpy as np
import os
import glob
import xgboost as xgb
from scipy.ndimage import median_filter
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

features_folder = r"DATASET\Enriched_Features"
all_files = sorted(glob.glob(os.path.join(features_folder, "*.csv")))

split_idx = int(len(all_files) * 0.8)
train_files = all_files[:split_idx]
test_files = all_files[split_idx:]

print(f"Loading {len(train_files)} training files and {len(test_files)} testing files...")
train_df = pd.concat([pd.read_csv(f) for f in train_files], ignore_index=True).dropna()
test_dfs = [pd.read_csv(f).dropna() for f in test_files]

X_train = train_df.drop(columns=['Target_Label'])
y_train = (train_df['Target_Label'] == 'N2').astype(int)

# Class weight balancing
scale_weight = (y_train == 0).sum() / (y_train == 1).sum()

print("Training Tuned XGBoost Classifier...")
model = xgb.XGBClassifier(
    n_estimators=400,
    learning_rate=0.025,
    max_depth=8,
    min_child_weight=3,
    gamma=0.1,
    subsample=0.85,
    colsample_bytree=0.85,
    scale_pos_weight=scale_weight,
    random_state=42,
    eval_metric='logloss',
    n_jobs=-1
)

model.fit(X_train, y_train)

# Evaluate per-subject with temporal smoothing
raw_predictions = []
smoothed_predictions = []
actual_labels = []

for subject_df in test_dfs:
    X_sub = subject_df.drop(columns=['Target_Label'])
    y_sub = (subject_df['Target_Label'] == 'N2').astype(int).values
    
    # Raw prediction probabilities
    preds_raw = model.predict(X_sub)
    
    # 3-Epoch Temporal Median Smoothing (Removes single-epoch physiological noise)
    preds_smoothed = median_filter(preds_raw, size=3, mode='nearest')
    
    raw_predictions.extend(preds_raw)
    smoothed_predictions.extend(preds_smoothed)
    actual_labels.extend(y_sub)

raw_acc = accuracy_score(actual_labels, raw_predictions)
smoothed_acc = accuracy_score(actual_labels, smoothed_predictions)

print(f"\n==========================================")
print(f"Raw Model Accuracy:      {raw_acc * 100:.2f}%")
print(f"With Temporal Smoothing: {smoothed_acc * 100:.2f}%")
print(f"==========================================\n")

print("--- Final Classification Report (Smoothed) ---")
print(classification_report(actual_labels, smoothed_predictions, target_names=['Non-N2', 'N2']))

# Save model
model.save_model("binary_sleep_model.json")
print("Model saved to binary_sleep_model.json!")