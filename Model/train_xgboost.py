import pandas as pd
import os
import glob
import xgboost as xgb
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

features_folder = r"DATASET\Features"

# 1. Subject-Wise Split (80/20 ratio roughly)
# Training: Subjects 002 to 080
train_files = [os.path.join(features_folder, f"training_features_S{i:03d}.csv") for i in range(2, 81)]
# Testing: Subjects 081 to 103
test_files = [os.path.join(features_folder, f"training_features_S{i:03d}.csv") for i in range(81, 104)]

print("Loading and combining training data...")
train_dfs = [pd.read_csv(f) for f in train_files if os.path.exists(f)]
train_df = pd.concat(train_dfs, ignore_index=True)

print("Loading and combining testing data...")
test_dfs = [pd.read_csv(f) for f in test_files if os.path.exists(f)]
test_df = pd.concat(test_dfs, ignore_index=True)

# 2. Separate Features (X) and Labels (y)
X_train = train_df.drop(columns=['Target_Label'])
y_train_text = train_df['Target_Label']

X_test = test_df.drop(columns=['Target_Label'])
y_test_text = test_df['Target_Label']

# XGBoost requires numeric labels (0 and 1) instead of text ("N2", "Non-N2")
# Let's make "N2" = 1 and "Non-N2" = 0
y_train = (y_train_text == 'N2').astype(int)
y_test = (y_test_text == 'N2').astype(int)

# 3. Handle the N2 Class Imbalance
# Calculate the ratio of negative (Non-N2) to positive (N2) samples
# This forces XGBoost to pay more attention to the minority classes
num_non_n2 = (y_train == 0).sum()
num_n2 = (y_train == 1).sum()
scale_weight = num_non_n2 / num_n2

print(f"\nTraining Samples: {len(X_train)} | Testing Samples: {len(X_test)}")
print(f"Applying scale_pos_weight: {scale_weight:.4f} to handle N2 imbalance")

# 4. Initialize and Train the XGBoost Model
print("\nTraining XGBoost Classifier...")
model = xgb.XGBClassifier(
    n_estimators=200,          # Number of trees
    learning_rate=0.05,        # How aggressively it learns
    max_depth=6,               # How complex each tree can get
    scale_pos_weight=scale_weight, # Fixes the imbalance
    random_state=42,
    eval_metric='logloss'
)

model.fit(X_train, y_train)

# 5. Evaluate the Model
print("\nMaking predictions on the test set...")
y_pred = model.predict(X_test)

print("\n--- Classification Report ---")
# Map the 0s and 1s back to their names for the printout
print(classification_report(y_test, y_pred, target_names=['Non-N2', 'N2']))

print("\n--- Confusion Matrix ---")
print(confusion_matrix(y_test, y_pred))

# Optional: See which features XGBoost found most useful
feature_importances = pd.DataFrame({
    'Feature': X_train.columns,
    'Importance': model.feature_importances_
}).sort_values(by='Importance', ascending=False)

print("\n--- Feature Importance ---")
print(feature_importances)
