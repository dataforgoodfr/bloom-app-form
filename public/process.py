import pandas as pd
import json

# Read the Excel file
df = pd.read_excel('./descriptions_engins.xlsx')

# Convert DataFrame to dictionary with index_image as keys
result = {}
for _, row in df.iterrows():
    # Get the index_image value
    key = row['index_image']
    
    # Create a dictionary of all other columns for this row
    row_dict = row.drop('index_image').to_dict()
    
    # Add to result dictionary
    result[key] = row_dict

# Write to JSON file
with open('./data/fishing_gear.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("Conversion completed! JSON file created at ./public/data/fishing_gear.json")
