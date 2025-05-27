import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split # Not strictly needed here as data is loaded
from sklearn.metrics import accuracy_score, classification_report, log_loss
import pickle
import joblib # Thư viện tốt hơn để lưu/load các đối tượng lớn như mô hình, dataframes
import time # Để đo thời gian huấn luyện
import os # Để làm việc với đường dẫn file
# No longer need to import EarlyStopping explicitly


# --- Load Preprocessed Data and Encoders ---
# Define the directory where preprocessed files were saved
save_dir = 'model3/' # Make sure this matches the directory used in preprocessing script

try:
    # Load the preprocessed data (assuming the preprocessing script saved them)
    X_train = joblib.load(os.path.join(save_dir, 'X_train_processed.pkl'))
    X_test = joblib.load(os.path.join(save_dir, 'X_test_processed.pkl'))
    y_train = joblib.load(os.path.join(save_dir, 'y_train.pkl'))
    y_test = joblib.load(os.path.join(save_dir, 'y_test.pkl'))

    # Load encoders and info needed for interpretation and future prediction
    with open(os.path.join(save_dir, 'label_encoder.pkl'), 'rb') as f:
        label_encoder = pickle.load(f)
    with open(os.path.join(save_dir, 'encoded_to_original_label_map.pkl'), 'rb') as f:
        encoded_to_original_label_map = pickle.load(f)
    with open(os.path.join(save_dir, 'processed_feature_info.pkl'), 'rb') as f:
        processed_feature_info = pickle.load(f) # Contains column names and dtypes


    print("Successfully loaded preprocessed data and encoders.")
    print(f"X_train shape: {X_train.shape}")
    print(f"y_train shape: {y_train.shape}")
    print(f"X_test shape: {X_test.shape}")
    print(f"y_test shape: {y_test.shape}")
    print(f"Number of classes: {len(label_encoder.classes_)}")
    print(f"Feature names (first 20): {X_train.columns.tolist()[:20]}...") # Show some feature names
    print(f"X_train dtypes (example):\n {X_train.dtypes.value_counts()}") # Show dtypes

except FileNotFoundError as e:
    print(f"Error loading files: {e}")
    print(f"Please ensure the preprocessing script has run successfully and saved the necessary files to '{save_dir}'.")
    exit()
except Exception as e:
    print(f"An error occurred during file loading: {e}")
    exit()


# --- Check for class imbalance ---
# This is important for multi-class classification
class_counts = pd.Series(y_train).value_counts()
print("\nClass Distribution in Training Data:")
print(class_counts)

# Calculate sample weights for imbalanced classes (optional but recommended)
# Use the ratio of the majority class count to each class count
sorted_class_counts = class_counts.sort_index()
majority_class_count = sorted_class_counts.max()
sample_weights_dict = {}
for encoded_label, count in sorted_class_counts.items():
     sample_weights_dict[encoded_label] = majority_class_count / count

print("\nCalculated Sample Weights based on Class Imbalance (for 'sample_weight' parameter):")
print(sample_weights_dict)

train_sample_weights = np.array([sample_weights_dict[label] for label in y_train])


# --- Initialize XGBoost Classifier ---

# Define model parameters
# These are starting points and can be tuned later
params = {
    'objective': 'multi:softprob',  # Use 'multi:softprob' to get probabilities for top-K prediction
    'num_class': len(label_encoder.classes_), # Number of unique disease classes
    'eval_metric': ['mlogloss', 'merror'],      # Use multiple evaluation metrics
    'enable_categorical': True,     # CRITICAL: Enable native categorical feature support
    # Parameters below are for tuning - start with reasonable defaults
    'n_estimators': 500,            # Increase estimators, use early stopping
    'learning_rate': 0.05,          # Smaller learning rate
    'max_depth': 6,                 # Maximum depth of trees
    'subsample': 0.7,               # Fraction of samples used for fitting the trees
    'colsample_bytree': 0.7,        # Fraction of features used per tree
    'gamma': 0.1,                   # Minimum loss reduction required to make a further partition
    'lambda': 1,                    # L2 regularization term
    'alpha': 0,                     # L1 regularization term
    'seed': 42,                     # Seed for reproducibility (XGBoost uses 'seed' parameter)
    # 'use_label_encoder': False      # This parameter is deprecated/removed in recent versions, remove if needed
}

print("\nInitializing XGBoost Classifier with parameters:", params)

model = xgb.XGBClassifier(**params)

# --- Train the Model (WITHOUT EARLY STOPPING IN FIT) ---

print("\nStarting model training (for full n_estimators, no early stopping in fit)...")
start_time = time.time()

# Use eval_set for monitoring performance during training
eval_set = [(X_train, y_train), (X_test, y_test)]
# eval_set_names = ['train', 'validation'] # Removed as eval_names is not supported in fit


try:
    # Train the model for the full number of estimators
    model.fit(X_train, y_train,
              eval_set=eval_set, # Keep eval_set for verbose output
              sample_weight=train_sample_weights,
              verbose=params['n_estimators'] // 10, # Print evaluation every 10% of estimators
              # Removed early_stopping_rounds, callbacks, and eval_names parameters
             )

except xgb.core.XGBoostError as e:
     print(f"An XGBoost error occurred during training: {e}")
     print("This might be related to data format, parameters, or environment.")
     exit()
except Exception as e:
     print(f"An unexpected error occurred during training: {e}")
     exit()


end_time = time.time()
print(f"\nModel training finished in {end_time - start_time:.2f} seconds.")

# --- Get best iteration and score (NOT applicable without early stopping in fit) ---
# When training for full n_estimators without early stopping in fit,
# best_score and best_iteration attributes are not set by the fit method itself.
# The effective number of trees used for prediction will be n_estimators.
best_score = None # Not available from this fit
best_iteration = None # Not available from this fit
best_ntree_limit = params['n_estimators'] # Use the full number of estimators

print("\nEarly stopping was not used in the fit method.")
print(f"Using total number of estimators ({best_ntree_limit}) for prediction.")


# --- Evaluate the Model on the Test Set ---

print("\nEvaluating model on the test set...")

# Use the full model (all estimators) for prediction
n_trees_to_use = best_ntree_limit


print(f"Predicting using {n_trees_to_use} boosting rounds...")

try:
    # Predict class labels (for accuracy and classification report)
    # No iteration_range needed when using the full model
    y_pred_encoded = model.predict(X_test)
    # Also predict probabilities for Top K
    y_proba = model.predict_proba(X_test)

except Exception as e:
    print(f"Error during prediction: {e}")
    # If prediction fails, report it
    print("Prediction failed.")
    exit() # Exit if prediction is not possible


# Calculate Accuracy
accuracy = accuracy_score(y_test, y_pred_encoded)
print(f"\nAccuracy on test set: {accuracy:.4f}")

# Calculate Classification Report
# Map encoded test labels back to original names for the report
# Get all unique labels present in the union of y_test and y_pred_encoded for robust report
all_evaluated_labels_encoded = np.unique(np.concatenate((y_test, y_pred_encoded)))
# Map these encoded labels to original names using the map
actual_original_names = [encoded_to_original_label_map.get(label, f"Unknown_{label}") for label in y_test] # Use .get for safety
predicted_original_names = [encoded_to_original_label_map.get(label, f"Unknown_{label}") for label in y_pred_encoded] # Use .get for safety

# Prepare target names for the report (all possible original disease names, sorted by encoded index)
# Ensure all possible classes are represented in target_names even if they don't appear in test/pred
target_names_list = [encoded_to_original_label_map.get(i, f"Unknown_{i}") for i in sorted(encoded_to_original_label_map.keys())]

print("\nClassification Report:")
# Use zero_division=0 to avoid warnings if a class has no predicted samples
# Pass labels parameter to classification_report if you want to include classes
# that are possible but not present in y_test/y_pred. Otherwise, it only reports on labels present.
try:
    # It's generally better to pass the *encoded* labels to classification_report's labels parameter
    # and use target_names to map them to strings. Ensure target_names_list is ordered by encoded index.
    print(classification_report(y_test, y_pred_encoded, labels=sorted(encoded_to_original_label_map.keys()), target_names=target_names_list, zero_division=0))
except ValueError as e:
     print(f"Warning generating classification report: {e}. Falling back to reporting only on observed labels.")
     # Fallback to reporting only on observed labels if mapping or label set is an issue
     print(classification_report(actual_original_names, predicted_original_names, zero_division=0))


# --- Get Top K Predictions ---

K = 5 # Set your desired K value (e.g., 5 for Top 5)
print(f"\nGetting Top {K} predictions (with probabilities) for test samples...")

if y_proba.shape[1] < K:
    print(f"Warning: Number of classes ({y_proba.shape[1]}) is less than K ({K}). Displaying top {y_proba.shape[1]} predictions instead.")
    K = y_proba.shape[1]

# y_proba contains probabilities from model.predict_proba(X_test) using the full model

# Get the indices of the top K probabilities for each sample
# np.argsort sorts indices in ascending order, [:, -K:] gets the last K columns (highest probabilities)
# [:, ::-1] reverses the order to get them from highest to lowest probability
top_k_indices = np.argsort(y_proba, axis=1)[:, -K:][:, ::-1] # Shape (n_samples, K)

# Get the corresponding probabilities for the top K indices
top_k_probabilities = np.take_along_axis(y_proba, top_k_indices, axis=1) # Shape (n_samples, K)


# Map the top K indices back to original disease names
top_k_predicted_names = []
for sample_indices in top_k_indices:
    # Ensure index exists in the map before looking up
    top_k_names_for_sample = [encoded_to_original_label_map.get(idx, f"Unknown_{idx}") for idx in sample_indices]
    top_k_predicted_names.append(top_k_names_for_sample)

# Display Top K predictions for the first few test samples
num_samples_to_display = 10
print(f"\nTop {K} predictions for the first {num_samples_to_display} test samples:")
for i in range(min(num_samples_to_display, len(X_test))):
    actual_name = actual_original_names[i] # Get actual name from the list created earlier
    predicted_top_k = top_k_predicted_names[i]
    probabilities_top_k = top_k_probabilities[i] # Get probabilities for this sample

    print(f"Sample {i+1}:")
    print(f"  Actual: {actual_name}")
    print(f"  Top {K} Predicted:")
    for rank in range(K):
        # Check if probability is > a small epsilon before printing (optional, for very small probabilities)
        if probabilities_top_k[rank] > 1e-6:
             print(f"    Rank {rank+1}: {predicted_top_k[rank]} (Probability: {probabilities_top_k[rank]:.4f})")
        else:
             # Print if probability is essentially zero
             print(f"    Rank {rank+1}: {predicted_top_k[rank]} (Probability: {probabilities_top_k[rank]:.4f})")


# --- Save the trained model ---
try:
    model_filename = os.path.join(save_dir, 'xgboost_disease_model_full_estimators.pkl') # Changed filename
    joblib.dump(model, model_filename) # Use joblib to save the sklearn API model
    print(f"\nTrained model saved to {model_filename}")
except Exception as e:
    print(f"Error saving model: {e}")


# --- Discussion on Top K vs All Probabilities ---
print("\n--- Discussion: Top K vs All Probabilities ---")
print(f"You chose to display K={K}. The model predicts probabilities for all {params['num_class']} diseases.")
print(f"Note: This model was trained for the full {params['n_estimators']} estimators without early stopping in fit due to compatibility issues.")
print("The model calculates a probability distribution over all possible diseases for each patient.")
print("Returning Top K predictions (e.g., Top 5) is suitable for presenting the most likely candidates to a user in a simple way.")
print("If you need the full probability distribution for a sample, you would use model.predict_proba() and process the entire output array (shape: (n_samples, n_classes)).")
print("For example, to get all predictions and probabilities for a single sample (index `i` in X_test):")
print("  sample_proba = y_proba[i]")
print("  sorted_indices = np.argsort(sample_proba)[::-1]") # Indices from highest to lowest probability
print("  all_predicted_names = [encoded_to_original_label_map.get(idx, f'Unknown_{{idx}}') for idx in sorted_indices]")
print("  all_probabilities = sample_proba[sorted_indices]")
print("This would give you the full ranked list of all diseases and their probabilities for that sample.")