import pandas as pd
import os
import glob
from tqdm import tqdm

processed_folder = r"DATASET\Processed"
features_folder = r"DATASET\Features"
enriched_folder = r"DATASET\Enriched_Features"
os.makedirs(enriched_folder, exist_ok=True)

rows_per_epoch = 3000

print("Generating multi-scale temporal & baseline features...")

for i in tqdm(range(2, 104), desc="Enriching Subjects"):
    file_name = f"S{i:03d}_PSG_df.csv"
    feature_name = f"training_features_S{i:03d}.csv"
    
    raw_file = os.path.join(processed_folder, file_name)
    feature_file = os.path.join(features_folder, feature_name)
    enriched_file = os.path.join(enriched_folder, feature_name)
    
    if not os.path.exists(raw_file) or not os.path.exists(feature_file):
        continue
        
    df = pd.read_csv(feature_file)
    
    # 1. Subject Baseline Normalization (Crucial for generalization)
    median_night_hr = df['HR'].median()
    df['HR_rel_median'] = df['HR'] / (median_night_hr + 1e-5)
    df['RMSSD_rel_median'] = df['RMSSD'] / (df['RMSSD'].median() + 1e-5)
    
    # 2. Ratio & Variability Features
    df['SD1_SD2_ratio'] = df['SD1'] / (df['SD2'] + 1e-5)
    df['CVNN'] = df['SDNN'] / (df['HR'] + 1e-5)
    
    # 3. Multi-Scale Rolling Averages (2 min, 5 min, 15 min, 30 min)
    # 2-minute (4 epochs)
    df['HR_roll_mean_2m'] = df['HR'].rolling(window=4, min_periods=1).mean()
    df['HR_roll_std_2m'] = df['HR'].rolling(window=4, min_periods=1).std().fillna(0)
    
    # 5-minute (10 epochs)
    df['HR_roll_mean_5m'] = df['HR'].rolling(window=10, min_periods=1).mean()
    df['HR_roll_std_5m'] = df['HR'].rolling(window=10, min_periods=1).std().fillna(0)
    df['RMSSD_roll_mean_5m'] = df['RMSSD'].rolling(window=10, min_periods=1).mean()
    df['RMSSD_roll_std_5m'] = df['RMSSD'].rolling(window=10, min_periods=1).std().fillna(0)
    df['SDNN_roll_mean_5m'] = df['SDNN'].rolling(window=10, min_periods=1).mean()
    
    # 15-minute (30 epochs)
    df['HR_roll_mean_15m'] = df['HR'].rolling(window=30, min_periods=1).mean()
    df['RMSSD_roll_mean_15m'] = df['RMSSD'].rolling(window=30, min_periods=1).mean()
    
    # 30-minute (60 epochs - captures sleep cycle trends)
    df['HR_roll_mean_30m'] = df['HR'].rolling(window=60, min_periods=1).mean()
    
    # 4. Deltas (Short-term velocity)
    df['HR_delta'] = df['HR'].diff().fillna(0)
    df['RMSSD_delta'] = df['RMSSD'].diff().fillna(0)
    
    # 5. Extract stage labels
    raw_stages = pd.read_csv(raw_file, usecols=['Sleep_Stage'])
    new_labels = []
    
    for start_idx in range(0, len(raw_stages), rows_per_epoch):
        end_idx = start_idx + rows_per_epoch
        chunk = raw_stages.iloc[start_idx:end_idx]
        if len(chunk) < rows_per_epoch:
            break
        new_labels.append(chunk['Sleep_Stage'].mode()[0])
        
    if len(new_labels) >= len(df):
        df['Target_Label'] = new_labels[:len(df)]
        df.to_csv(enriched_file, index=False)

print("\nEnrichment complete! Multi-scale features generated.")