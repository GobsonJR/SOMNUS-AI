import pandas as pd
import neurokit2 as nk
import warnings
import os
from tqdm import tqdm

# Ignore warnings from noisy signal chunks
warnings.filterwarnings('ignore')

processed_folder = r"DATASET\Processed"
# Create a new folder just for your extracted feature files
features_folder = r"DATASET\Features"
os.makedirs(features_folder, exist_ok=True)

# Dataset parameters
sampling_rate = 100 
window_size_seconds = 30
rows_per_epoch = sampling_rate * window_size_seconds 

print("Starting batch extraction for S003 to S103...")
print(f"Features will be saved individually into the {features_folder} folder.")

# Loop through subjects 2 to 103
for i in range(2, 104):
    file_name = f"S{i:03d}_PSG_df.csv"
    input_file = os.path.join(processed_folder, file_name)
    
    # Name the output file for this specific subject
    output_file_name = f"training_features_S{i:03d}.csv"
    output_file = os.path.join(features_folder, output_file_name)
    
    # Skip if the raw processed file is missing
    if not os.path.exists(input_file):
        print(f"\nSkipping {file_name} - File not found.")
        continue
        
    print(f"\n--- Extracting {file_name} ---")
    df = pd.read_csv(input_file)
    features_list = []
    
    total_chunks = len(df) // rows_per_epoch
    
    # Extract features with a progress bar for the current file
    for start_idx in tqdm(range(0, len(df), rows_per_epoch), total=total_chunks, desc=file_name):
        end_idx = start_idx + rows_per_epoch
        chunk = df.iloc[start_idx:end_idx]
        
        if len(chunk) < rows_per_epoch:
            break
            
        ecg_signal = chunk['ECG'].values
        majority_stage = chunk['Sleep_Stage'].mode()[0]
        
        # Convert standard sleep stages to binary N2 vs Non-N2
        target_label = "N2" if majority_stage == "N2" else "Non-N2"
        
        try:
            signals, info = nk.ecg_process(ecg_signal, sampling_rate=sampling_rate)
            hrv_time = nk.hrv_time(info['ECG_R_Peaks'], sampling_rate=sampling_rate)
            hrv_nonlin = nk.hrv_nonlinear(info['ECG_R_Peaks'], sampling_rate=sampling_rate)
            
            epoch_features = {
                'HR': signals['ECG_Rate'].mean(),
                'RMSSD': hrv_time['HRV_RMSSD'].values[0],
                'SDNN': hrv_time['HRV_SDNN'].values[0],
                'pNN50': hrv_time['HRV_pNN50'].values[0],
                'SD1': hrv_nonlin['HRV_SD1'].values[0],
                'SD2': hrv_nonlin['HRV_SD2'].values[0],
                'Target_Label': target_label
            }
            features_list.append(epoch_features)
            
        except Exception:
            pass
            
    # Save this subject's data as its own individual file
    if features_list:
        features_df = pd.DataFrame(features_list)
        features_df.to_csv(output_file, index=False)
        print(f"Saved {len(features_df)} rows to {output_file_name}")

print("\nALL FILES PROCESSED SUCCESSFULLY!")