import pandas as pd
import os

# Define your paths 
raw_folder = r"DATASET\Raw"
processed_folder = r"DATASET\Processed"

# Create the processed folder if it doesn't exist
os.makedirs(processed_folder, exist_ok=True)

# The exact column names we want to keep
columns_to_keep = ['ECG', 'Sleep_Stage']

print("Starting extraction from S002 to S103...")

# Loop through numbers 2 to 103 inclusive
for i in range(2, 104):
    # Format the number to have leading zeros (e.g., 2 becomes '002')
    file_name = f"S{i:03d}_PSG_df.csv"
    file_path = os.path.join(raw_folder, file_name)
    output_path = os.path.join(processed_folder, file_name)
    
    # Check if the file actually exists before trying to open it
    if not os.path.exists(file_path):
        print(f"Skipping {file_name} - File not found in Raw folder.")
        continue
        
    print(f"Processing {file_name}...")
    
    try:
        # Load only the required columns
        df = pd.read_csv(file_path, usecols=columns_to_keep)
        
        # Save to Processed folder
        df.to_csv(output_path, index=False)
        print(f"Successfully saved {file_name}")
        
    except ValueError as e:
        print(f"Error with {file_name}: {e}. (Check column names)")
    except Exception as e:
        print(f"Unexpected error processing {file_name}: {e}")

print("Extraction complete!")