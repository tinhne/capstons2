# File: model3/preprocess_and_train.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
import re
import unicodedata
import ast # Required to parse list strings
import pickle # For saving encoders
import joblib # For saving larger objects like DataFrames/arrays, model
import os # To create directory for saving files
import time # To measure training time
import xgboost as xgb # Import XGBoost
# REMOVED: from xgboost import callback as xgb_callback # No longer needed
from sklearn.metrics import classification_report # Import classification_report
from sklearn.metrics import accuracy_score # Make sure accuracy_score is imported

# --- Helper functions (defined before being used) ---

def remove_vietnamese_diacritics(text):
    """Loại bỏ dấu tiếng Việt và chuyển 'đ' thành 'd'."""
    if not isinstance(text, str):
        return ''
    text = text.lower()
    tv_chars_map = {
        ord('á'): 'a', ord('à'): 'a', ord('ả'): 'a', ord('ã'): 'a', ord('ạ'): 'a',
        ord('ă'): 'a', ord('ắ'): 'a', ord('ằ'): 'a', ord('ẳ'): 'a', ord('ẵ'): 'a', ord('ặ'): 'a',
        ord('â'): 'a', ord('ấ'): 'a', ord('ầ'): 'a', ord('ẩ'): 'a', ord('ẫ'): 'a', ord('ậ'): 'a',
        ord('đ'): 'd',
        ord('é'): 'e', ord('è'): 'e', ord('ẻ'): 'e', ord('ẽ'): 'e', ord('ẹ'): 'e',
        ord('ê'): 'e', ord('ế'): 'e', ord('ề'): 'e', ord('ể'): 'e', ord('ễ'): 'e', ord('ệ'): 'e',
        ord('í'): 'i', ord('ì'): 'i', ord('ỉ'): 'i', ord('ĩ'): 'i', ord('ị'): 'i',
        ord('ó'): 'o', ord('ò'): 'o', ord('ỏ'): 'o', ord('õ'): 'o', ord('ọ'): 'o',
        ord('ô'): 'o', ord('ố'): 'o', ord('ồ'): 'o', ord('ổ'): 'o', ord('ỗ'): 'o', ord('ộ'): 'o',
        ord('ơ'): 'o', ord('ớ'): 'o', ord('ờ'): 'o', ord('ở'): 'o', ord('ỡ'): 'o', ord('ợ'): 'o',
        ord('ú'): 'u', ord('ù'): 'u', ord('ủ'): 'u', ord('ũ'): 'u', ord('ụ'): 'u',
        ord('ư'): 'u', ord('ứ'): 'u', ord('ừ'): 'u', ord('ử'): 'u', ord('ữ'): 'u', ord('ự'): 'u',
        ord('ý'): 'y', ord('ỳ'): 'y', ord('ỷ'): 'y', ord('ỹ'): 'y', ord('ỵ'): 'y',
        ord('Á'): 'a', ord('À'): 'a', ord('Ả'): 'a', ord('Ã'): 'a', ord('Ạ'): 'a',
        ord('Ă'): 'a', ord('Ắ'): 'a', ord('Ằ'): 'a', ord('Ẳ'): 'a', ord('Ẵ'): 'a', ord('Ặ'): 'a',
        ord('Â'): 'a', ord('Ấ'): 'a', ord('Ầ'): 'a', ord('Ẩ'): 'a', ord('Ẫ'): 'a', ord('Ậ'): 'a',
        ord('Đ'): 'd',
        ord('É'): 'e', ord('È'): 'e', ord('Ẻ'): 'e', ord('Ẽ'): 'e', ord('Ẹ'): 'e',
        ord('Ê'): 'e', ord('ế'): 'e', ord('ề'): 'e', ord('ể'): 'e', ord('ễ'): 'e', ord('ệ'): 'e',
        ord('í'): 'i', ord('ì'): 'i', ord('ỉ'): 'i', ord('ĩ'): 'i', ord('ị'): 'i',
        ord('ó'): 'o', ord('ò'): 'o', ord('ỏ'): 'o', ord('õ'): 'o', ord('ọ'): 'o',
        ord('ô'): 'o', ord('ố'): 'o', ord('ồ'): 'o', ord('ổ'): 'o', ord('ỗ'): 'o', ord('ộ'): 'o',
        ord('ơ'): 'o', ord('ớ'): 'o', ord('ờ'): 'o', ord('ở'): 'o', ord('ỡ'): 'o', ord('ợ'): 'o',
        ord('ú'): 'u', ord('ù'): 'u', ord('ủ'): 'u', ord('ũ'): 'u', ord('ụ'): 'u',
        ord('ư'): 'u', ord('ứ'): 'u', ord('ừ'): 'u', ord('ử'): 'u', ord('ữ'): 'u', ord('ự'): 'u',
        ord('ý'): 'y', ord('ỳ'): 'y', ord('ỷ'): 'y', ord('ỹ'): 'y', ord('ỵ'): 'y',
    }
    processed_text = text.translate(tv_chars_map)
    cleaned_text = re.sub(r'[^a-z0-9_ ]', '', processed_text)
    return cleaned_text

def normalize_string(text):
    """Chuẩn hóa chuỗi: bỏ dấu, chuyển 'đ'->'d', lower, space->'_', loại bỏ ký tự đặc biệt."""
    if not isinstance(text, str):
        return ''
    processed_text = remove_vietnamese_diacritics(text).lower()
    normalized_text = re.sub(r'\s+', '_', processed_text).strip('_') # Replace spaces with underscores, remove leading/trailing underscores
    normalized_text = re.sub(r'[^a-z0-9_]', '', normalized_text) # Remove any other non-alphanumeric/underscore
    return normalized_text

def normalize_benh_name(benh_name):
    """Chuẩn hóa tên bệnh thành key phù hợp với schema và encoding."""
    return normalize_string(benh_name)

def parse_and_normalize_list_string(list_string_or_list):
    """Parses a string representation of a list or processes an actual list,
       normalizing each valid string item within it."""
    parsed_list = []
    if isinstance(list_string_or_list, str):
        try:
            parsed_list = ast.literal_eval(list_string_or_list)
        except (ValueError, SyntaxError, TypeError):
            return [] # Invalid list string
    elif isinstance(list_string_or_list, list):
        parsed_list = list_string_or_list
    else:
        return [] # Not a list or list string

    if isinstance(parsed_list, list):
        normalized_list = [normalize_string(item) for item in parsed_list if isinstance(item, str)]
        return [item for item in normalized_list if item] # Filter empty strings
    else:
        return []


# --- Load the data ---
file_path = 'model3/fake_health_data_50k.csv' # Adjust if your file name/path is different
try:
    df = pd.read_csv(file_path)
    print(f"Successfully loaded data from {file_path}. Shape: {df.shape}")
    print("Original columns:", df.columns.tolist())
except FileNotFoundError:
    print(f"Error: File not found at {file_path}. Please ensure the generation script has run successfully and created this file.")
    exit()
except Exception as e:
    print(f"Error loading data: {e}")
    exit()

# --- Data Cleaning and Preparation ---

# Handle potential missing values
# Drop rows where essential columns are NaN. Decide which columns are essential.
essential_cols = ['benh', 'gioi_tinh', 'do_tuoi', 'dia_diem', 'thoi_gian']
df.dropna(subset=essential_cols, inplace=True)
print(f"\nShape after dropping NaNs in essential columns: {df.shape}")

# Convert list-like strings to actual lists with normalized items
df['trieu_chung_normalized'] = df['trieu_chung'].apply(
    lambda x: parse_and_normalize_list_string(x) if pd.notna(x) else []
)
df['yeu_to_nguy_co_normalized'] = df['yeu_to_nguy_co'].apply(
    lambda x: parse_and_normalize_list_string(x) if pd.notna(x) else []
)

df.drop(['trieu_chung', 'yeu_to_nguy_co'], axis=1, inplace=True, errors='ignore')

# Process 'thoi_gian'
try:
    df['thoi_gian'] = pd.to_datetime(df['thoi_gian'], errors='coerce')
    df.dropna(subset=['thoi_gian'], inplace=True)
    print(f"\nShape after dropping rows with invalid 'thoi_gian': {df.shape}")

    df['thang'] = df['thoi_gian'].dt.month
    df['ngay_trong_tuan'] = df['thoi_gian'].dt.dayofweek # 0=Monday, 6=Sunday
    df['nam'] = df['thoi_gian'].dt.year

    df['thang'] = df['thang'].astype('category')
    df['ngay_trong_tuan'] = df['ngay_trong_tuan'].astype('category')

    extracted_time_cols = ['thang', 'ngay_trong_tuan', 'nam']

except Exception as e:
    print(f"Warning: Could not process 'thoi_gian' column fully. Error: {e}")
    df.drop([col for col in ['thoi_gian', 'thang', 'ngay_trong_tuan', 'nam'] if col in df.columns], axis=1, inplace=True, errors='ignore')
    extracted_time_cols = []

df.drop('thoi_gian', axis=1, inplace=True, errors='ignore')
if 'mua' in df.columns:
     df.drop('mua', axis=1, inplace=True, errors='ignore')

print(f"\nShape after cleaning and initial feature extraction: {df.shape}")
print("Columns after initial feature extraction:", df.columns.tolist())

# --- Feature Engineering / Encoding for XGBoost ---

labels_full_original = df['benh']
features_df = df.drop('benh', axis=1)

# 1. Encode Target Variable ('benh')
labels_normalized = labels_full_original.apply(normalize_benh_name)
label_encoder = LabelEncoder()
labels_encoded = label_encoder.fit_transform(labels_normalized)

unique_original_labels = labels_full_original.unique()
unique_normalized_labels_fitted = label_encoder.classes_

encoded_to_original_label_map = {}
for i, normalized_name in enumerate(unique_normalized_labels_fitted):
     for original_name in unique_original_labels:
          if normalize_benh_name(original_name) == normalized_name:
               encoded_to_original_label_map[i] = original_name
               break
     if i not in encoded_to_original_label_map:
          encoded_to_original_label_map[i] = normalized_name

if len(encoded_to_original_label_map) != len(unique_normalized_labels_fitted):
    print("Warning: Mapping from encoded label to original name might be incomplete.")

print("\nUnique encoded labels:", np.unique(labels_encoded))
print("Mapping (encoded -> original name):", encoded_to_original_label_map)

# 2. Identify Feature Types for XGBoost
numerical_cols = ['do_tuoi']
if 'nam' in features_df.columns:
    numerical_cols.append('nam')

categorical_cols_native = ['gioi_tinh', 'dia_diem']
if 'thang' in features_df.columns: categorical_cols_native.append('thang')
if 'ngay_trong_tuan' in features_df.columns: categorical_cols_native.append('ngay_trong_tuan')

multilabel_cols = ['trieu_chung_normalized', 'yeu_to_nguy_co_normalized']

# 3. Process Multi-label Features
mlb_symptoms = MultiLabelBinarizer()
features_encoded_symptoms_df = pd.DataFrame(index=features_df.index)
if multilabel_cols[0] in features_df.columns:
    features_encoded_symptoms = mlb_symptoms.fit_transform(features_df[multilabel_cols[0]])
    symptom_col_names = [f'symptom_{col}' for col in mlb_symptoms.classes_]
    features_encoded_symptoms_df = pd.DataFrame(features_encoded_symptoms, columns=symptom_col_names, index=features_df.index)
    print(f"\nNumber of unique symptoms identified: {len(mlb_symptoms.classes_)}")
else:
     print(f"Warning: Multi-label column '{multilabel_cols[0]}' not found.")
     mlb_symptoms.classes_ = np.array([])

mlb_risks = MultiLabelBinarizer()
features_encoded_risks_df = pd.DataFrame(index=features_df.index)
if multilabel_cols[1] in features_df.columns:
    features_encoded_risks = mlb_risks.fit_transform(features_df[multilabel_cols[1]])
    risk_col_names = [f'risk_{col}' for col in mlb_risks.classes_]
    features_encoded_risks_df = pd.DataFrame(features_encoded_risks, columns=risk_col_names, index=features_df.index)
    print(f"Number of unique risk factors identified: {len(mlb_risks.classes_)}")
else:
     print(f"Warning: Multi-label column '{multilabel_cols[1]}' not found.")
     mlb_risks.classes_ = np.array([])

features_df.drop(multilabel_cols, axis=1, inplace=True, errors='ignore')

# 4. Select & handle specified categorical columns
features_categorical_native = features_df[[col for col in categorical_cols_native if col in features_df.columns]].copy()
for col in features_categorical_native.columns:
     if not isinstance(features_categorical_native[col].dtype, pd.CategoricalDtype):
          print(f"Info: Column '{col}' is not 'category' dtype. Converting now.")
          if features_categorical_native[col].dtype == 'object':
               features_categorical_native[col] = features_categorical_native[col].apply(normalize_string)
          features_categorical_native[col] = features_categorical_native[col].astype('category')

# 5. Select numerical columns
features_numerical = features_df[[col for col in numerical_cols if col in features_df.columns]]

# --- Combine all features ---
features_numerical = features_numerical.reset_index(drop=True)
features_categorical_native = features_categorical_native.reset_index(drop=True)
features_encoded_symptoms_df = features_encoded_symptoms_df.reset_index(drop=True)
features_encoded_risks_df = features_encoded_risks_df.reset_index(drop=True)

dfs_to_concat = [features_numerical, features_categorical_native, features_encoded_symptoms_df, features_encoded_risks_df]
dfs_to_concat = [df for df in dfs_to_concat if not df.empty]

if not dfs_to_concat:
    print("Error: No features generated after preprocessing! Exiting.")
    exit()

features_processed = pd.concat(dfs_to_concat, axis=1)

print("\nShape of final processed features DataFrame:", features_processed.shape)
print("\nFirst 5 rows of processed features:\n", features_processed.head())
print("\nColumns of processed features DataFrame (first 20):", features_processed.columns.tolist()[:20], "...")
print("\nDtypes of processed features:\n", features_processed.dtypes.value_counts())

# --- Collect Categorical Categories for Saving ---
categorical_categories_map = {}
for col in categorical_cols_native:
     if col in features_processed.columns and isinstance(features_processed[col].dtype, pd.CategoricalDtype):
          categorical_categories_map[col] = features_processed[col].cat.categories.tolist()
     else:
          print(f"Warning: Categories not collected for column '{col}' as it's not in final DF or not 'category' dtype.")

print("\nCollected categorical categories map:", categorical_categories_map)

# --- Prepare Data for Splitting ---
X_full_df = features_processed
y_full = labels_encoded

# --- Split data into training and testing sets ---
print("\nSplitting data into training and testing sets...")

unique_classes, counts = np.unique(y_full, return_counts=True)
classes_with_one_sample = unique_classes[counts == 1]

if len(unique_classes) < 2:
    print("Error: Only one class present in the target variable. Cannot perform classification. Exiting.")
    exit()

if len(classes_with_one_sample) > 0:
    print(f"Warning: Classes {classes_with_one_sample} have only one sample. Stratification might fail or lead to these classes being only in train or test set.")

try:
    X_train_processed, X_test_processed, y_train, y_test = train_test_split(
        X_full_df, y_full, test_size=0.2, random_state=42, stratify=y_full
    )
    print("\nData split successfully.")
except ValueError as e:
    print(f"Error during train_test_split with stratification: {e}")
    print("This often happens if some classes have only one sample or test_size is too small.")
    print("Consider removing classes with very few samples or using a different splitting strategy.")
    exit()

print("\n--- Final Dataset Shapes & Types for XGBoost Training ---")
print("X_train (DataFrame) shape:", X_train_processed.shape)
print("X_train dtypes:\n", X_train_processed.dtypes.value_counts())
print("y_train (NumPy array) shape:", y_train.shape)
print("X_test (DataFrame) shape:", X_test_processed.shape)
print("X_test dtypes:\n", X_test_processed.dtypes.value_counts())
print("y_test (NumPy array) shape:", y_test.shape)

# --- Check for class imbalance and prepare weights ---
class_counts = pd.Series(y_train).value_counts().sort_index()
print("\nClass Distribution in Training Data (encoded labels):")
print(class_counts)

majority_class_count = class_counts.max()
sample_weights_dict = {}
for encoded_label, count in class_counts.items():
     sample_weights_dict[encoded_label] = majority_class_count / count

print("\nCalculated Sample Weights based on Class Imbalance (for 'sample_weight' parameter):")
print(sample_weights_dict)

train_sample_weights = np.array([sample_weights_dict[label] for label in y_train])

# --- Save preprocessed data files (.pkl) and encoders ---
save_dir = 'model3/'
os.makedirs(save_dir, exist_ok=True)

try:
    joblib.dump(X_train_processed, os.path.join(save_dir, 'X_train_processed.pkl'))
    joblib.dump(X_test_processed, os.path.join(save_dir, 'X_test_processed.pkl'))
    joblib.dump(y_train, os.path.join(save_dir, 'y_train.pkl'))
    joblib.dump(y_test, os.path.join(save_dir, 'y_test.pkl'))

    print(f"\nSuccessfully saved preprocessed data files to '{save_dir}' using joblib.")

except Exception as e:
    print(f"\nError saving preprocessed data files: {e}")

try:
    with open(os.path.join(save_dir, 'label_encoder.pkl'), 'wb') as f:
        pickle.dump(label_encoder, f)
    with open(os.path.join(save_dir, 'multilabel_binarizer_symptoms.pkl'), 'wb') as f:
        pickle.dump(mlb_symptoms, f)
    with open(os.path.join(save_dir, 'multilabel_binarizer_risks.pkl'), 'wb') as f:
        pickle.dump(mlb_risks, f)

    processed_feature_info = {
        'columns': features_processed.columns.tolist(),
        'dtypes': features_processed.dtypes.apply(lambda x: x.name).to_dict(),
        'categorical_categories': categorical_categories_map
    }
    with open(os.path.join(save_dir, 'processed_feature_info.pkl'), 'wb') as f:
         pickle.dump(processed_feature_info, f)

    with open(os.path.join(save_dir, 'encoded_to_original_label_map.pkl'), 'wb') as f:
         pickle.dump(encoded_to_original_label_map, f)

    print(f"Encoders, processed feature info (columns, dtypes, categories), and label map saved to '{save_dir}'.")

except Exception as e:
    print(f"\nError saving encoder and info files: {e}")

print("\nPreprocessing complete. Data (with 'category' dtypes for native XGBoost handling) is ready for training.")

# --- Initialize and Train XGBoost Classifier ---

print("\n--- Starting XGBoost Model Training ---")

params = {
    'objective': 'multi:softprob',
    'num_class': len(label_encoder.classes_),
    'eval_metric': ['mlogloss', 'merror'],
    'enable_categorical': True,
    'n_estimators': 1000, # Train for this fixed number of estimators
    'learning_rate': 0.05,
    'max_depth': 6,
    'subsample': 0.7,
    'colsample_bytree': 0.7,
    'gamma': 0.1,
    'lambda': 1,
    'alpha': 0,
    'seed': 42,
    'n_jobs': -1
}

print("\nInitializing XGBoost Classifier with parameters:", params)

model = xgb.XGBClassifier(**params)

# --- Train the Model (WITHOUT EARLY STOPPING PARAMETERS IN FIT) ---

print("\nStarting model training for a fixed number of estimators...")
start_time = time.time()

# We can still use eval_set just to *see* the evaluation metrics during training,
# even without Early Stopping being triggered by them.
eval_set = [(X_train_processed, y_train), (X_test_processed, y_test)]

try:
    # Train the model without any early stopping parameters in the fit method
    model.fit(X_train_processed, y_train,
              eval_set=eval_set, # Keep eval_set to see metrics if verbose > 0
              sample_weight=train_sample_weights,
              verbose=params['n_estimators'] // 10 # Print progress every 10%
              # Removed: early_stopping_rounds, callbacks, eval_names
             )

except Exception as e:
     print(f"An unexpected error occurred during training: {e}")
     # Decide whether to exit or continue
     # exit() # Uncomment to exit on training error


end_time = time.time()
print(f"\nModel training finished in {end_time - start_time:.2f} seconds.")

# --- Get best iteration and score (N/A without Early Stopping parameters) ---
# These attributes are NOT populated when early stopping parameters are not used in fit
best_iteration = None # Not applicable
best_score = 'N/A' # Not applicable
best_ntree_limit = params['n_estimators'] # Model trained for full estimators

print(f"\nModel trained for the full {best_ntree_limit} estimators (no Early Stopping triggered by fit parameters).")
# We don't have a 'best_score' from the fit method in this case.


# --- Evaluate the Model on the Test Set ---

print("\nEvaluating model on the test set (using the full trained model)...")

try:
    # Predict class labels. The sklearn API should handle using the full trained model.
    y_pred_encoded = model.predict(X_test_processed)

    # Predict probabilities for Top K.
    y_proba = model.predict_proba(X_test_processed)

except Exception as e:
    print(f"Error during prediction: {e}")
    print("Prediction failed. Cannot evaluate.")
    exit()


# Calculate Accuracy
accuracy = accuracy_score(y_test, y_pred_encoded)
print(f"\nAccuracy on test set: {accuracy:.4f}")

# Calculate Classification Report
target_names_list = [encoded_to_original_label_map.get(i, f"Unknown_{i}") for i in sorted(encoded_to_original_label_map.keys())]

print("\nClassification Report:")
try:
    all_possible_encoded_labels = sorted(encoded_to_original_label_map.keys())
    print(classification_report(y_test, y_pred_encoded, labels=all_possible_encoded_labels, target_names=target_names_list, zero_division=0))

except ValueError as e:
     print(f"Warning generating classification report: {e}. Falling back to default report (may miss classes).")
     print(classification_report(y_test, y_pred_encoded, zero_division=0))
except Exception as e:
    print(f"An unexpected error occurred while generating classification report: {e}")


# --- Get Top K Predictions (Example on Test Set) ---

K = 5
print(f"\nGetting Top {K} predictions (with probabilities) for test samples...")

if y_proba.shape[1] < K:
    print(f"Warning: Number of classes ({y_proba.shape[1]}) is less than K ({K}). Displaying top {y_proba.shape[1]} predictions instead.")
    K = y_proba.shape[1]
elif K <= 0:
     K = min(5, y_proba.shape[1])
     print(f"Invalid K value ({K}). Setting K to {K}.")


top_k_indices = np.argsort(y_proba, axis=1)[:, -K:][:, ::-1]

top_k_probabilities = np.take_along_axis(y_proba, top_k_indices, axis=1)

actual_original_names_test = [encoded_to_original_label_map.get(label, f"Unknown_{label}") for label in y_test]

print(f"\nTop {K} predictions for the first few test samples:")
num_samples_to_display = 10
for i in range(min(num_samples_to_display, len(X_test_processed))):
    actual_name = actual_original_names_test[i]
    predicted_top_k_indices_sample = top_k_indices[i]
    probabilities_top_k_sample = top_k_probabilities[i]

    print(f"Sample {i+1}:")
    print(f"  Actual: {actual_name}")
    print(f"  Top {K} Predicted:")
    for rank in range(K):
        predicted_index = predicted_top_k_indices_sample[rank]
        predicted_name = encoded_to_original_label_map.get(predicted_index, f"Unknown_Index_{predicted_index}")
        probability = probabilities_top_k_sample[rank]
        print(f"    Rank {rank+1}: {predicted_name} (Probability: {probability:.4f})")


# --- Save the trained model ---
try:
    model_filename = os.path.join(save_dir, 'xgboost_disease_model.pkl') # Standard name
    joblib.dump(model, model_filename) # Use joblib to save the sklearn API model
    print(f"\nTrained model saved to {model_filename}")
except Exception as e:
    print(f"Error saving model: {e}")

print("\nPreprocessing and Training complete.")