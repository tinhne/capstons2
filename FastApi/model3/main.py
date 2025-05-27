# File: model3/main.py

from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional
import pandas as pd
import joblib
import xgboost as xgb
import numpy as np
import logging
import os
from datetime import datetime # For handling date input
import re
import ast # Required to parse list strings if symptoms/risks come as string representation of list
import pickle # For loading objects

# --- Import necessary components from sklearn (used only for type hinting/clarity, objects loaded) ---
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer

# --- Helper Functions (Identical to preprocessing script) ---

def remove_vietnamese_diacritics(text):
    """Loại bỏ dấu tiếng Việt và chuyển 'đ' thành 'd'."""
    if not isinstance(text, str):
        return ''
    # Convert to lowercase early for case-insensitive handling
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
        ord('í'): 'i', ord('Ì'): 'i', ord('Ỉ'): 'i', ord('Ĩ'): 'i', ord('Ị'): 'i',
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

# --- Configuration and Logging ---
logging.basicConfig(
    filename='api.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

model_dir = 'model3/'

# --- Load Model and Preprocessing Objects ---
def load_model_and_preprocessing_objects(model_directory):
    """Tải model XGBoost đã huấn luyện, các encoders và thông tin features."""
    try:
        # Load the XGBoost model (standard name)
        model_file_path = os.path.join(model_directory, 'xgboost_disease_model.pkl')

        if not os.path.exists(model_file_path):
             raise FileNotFoundError(f"Model file not found at: {model_file_path}")

        model = joblib.load(model_file_path)
        logger.info(f"Loading model from: {model_file_path}")

        # Load encoders and info needed
        label_encoder = pickle.load(open(os.path.join(model_directory, 'label_encoder.pkl'), 'rb'))
        mlb_symptoms = pickle.load(open(os.path.join(model_directory, 'multilabel_binarizer_symptoms.pkl'), 'rb'))
        mlb_risks = pickle.load(open(os.path.join(model_directory, 'multilabel_binarizer_risks.pkl'), 'rb'))

        # Load processed_feature_info (includes columns, dtypes, and categories)
        processed_feature_info_path = os.path.join(model_directory, 'processed_feature_info.pkl')
        if not os.path.exists(processed_feature_info_path):
             raise FileNotFoundError(f"Processed feature info file not found at: {processed_feature_info_path}")
        processed_feature_info = pickle.load(open(processed_feature_info_path, 'rb'))

        encoded_to_original_label_map = pickle.load(open(os.path.join(model_directory, 'encoded_to_original_label_map.pkl'), 'rb'))

        # Ensure categorical_categories is present in info
        if 'categorical_categories' not in processed_feature_info:
             logger.warning("'categorical_categories' not found in processed_feature_info. This will impact processing categorical features.")
             processed_feature_info['categorical_categories'] = {} # Add empty dict as fallback

        logger.info("Model and preprocessing objects loaded successfully.")
        if hasattr(model, 'n_features_in_'):
             logger.info(f"Number of features expected by model: {model.n_features_in_}")
        if hasattr(model, 'classes_'):
             logger.info(f"Number of classes expected by model: {len(model.classes_)}")


        # Get the list of all unique symptoms and risk factors from the MultiLabelBinarizers
        all_symptoms_list = [s for s in mlb_symptoms.classes_] if mlb_symptoms.classes_ is not None else []
        all_risk_factors_list = [r for r in mlb_risks.classes_] if mlb_risks.classes_ is not None else []


        return model, label_encoder, mlb_symptoms, mlb_risks, processed_feature_info, encoded_to_original_label_map, all_symptoms_list, all_risk_factors_list
    except FileNotFoundError as e:
        logger.error(f"Error loading model or preprocessing files: {str(e)}")
        logger.error("Please ensure the model and preprocessing files are in the correct directory.")
        logger.error(f"Attempted to load from directory: {os.path.abspath(model_directory)}")
        if os.path.exists(model_directory):
            logger.error(f"Contents of directory: {os.listdir(model_directory)}")
        else:
            logger.error(f"Directory '{model_directory}' does not exist.")
        # Re-raise the exception to prevent the API from starting
        raise
    except Exception as e:
        logger.error(f"An unexpected error occurred during loading: {str(e)}")
        # Re-raise the exception
        raise


# --- Pydantic Input Model ---
class PatientInput(BaseModel):
    """Định nghĩa model dữ liệu đầu vào cho dự đoán bệnh."""
    gioi_tinh: str = Field(..., description="Giới tính (Ví dụ: Nam, Nữ)")
    do_tuoi: int = Field(..., description="Tuổi của bệnh nhân", ge=1, le=120) # ge= >=, le= <=
    dia_diem: str = Field(..., description="Thành phố/Tỉnh nơi bệnh nhân sinh sống (Ví dụ: Hà Nội, TP.HCM)")
    thoi_gian: datetime = Field(..., description="Thời gian xảy ra triệu chứng (định dạng ISO 8601, ví dụ: 2024-11-20T10:00:00)")
    trieu_chung: List[str] = Field(..., description="Danh sách các triệu chứng của bệnh nhân (Ví dụ: ['Sốt', 'Ho'])")
    yeu_to_nguy_co: List[str] = Field(..., description="Danh sách các yếu tố nguy cơ của bệnh nhân (Ví dụ: ['Hút thuốc lá', 'Tiền sử bệnh tim mạch'])")
    top_k: int = Field(5, description="Số lượng bệnh hàng đầu muốn dự đoán", ge=1)

# --- Data Preprocessing Function for New Input ---
def preprocess_new_data(
    raw_input_data: PatientInput,
    mlb_symptoms: MultiLabelBinarizer,
    mlb_risks: MultiLabelBinarizer,
    processed_feature_info: dict # Contains 'columns', 'dtypes', and 'categorical_categories'
) -> pd.DataFrame:
    """
    Tiền xử lý dữ liệu đầu vào thô (từ API) thành định dạng mà model XGBoost mong đợi.
    Sử dụng các encoders và thông tin feature đã fit từ dữ liệu huấn luyện.
    """
    # Get expected training columns, dtypes, and categories
    training_columns = processed_feature_info.get('columns', [])
    training_dtypes_map = processed_feature_info.get('dtypes', {})
    training_categories_map = processed_feature_info.get('categorical_categories', {})

    if not training_columns:
         raise ValueError("Training column information not loaded correctly. Cannot preprocess new data.")

    # Create an empty DataFrame with all expected training columns, initialized with 0
    # This ensures all columns the model expects are present
    processed_df_new = pd.DataFrame(0, index=[0], columns=training_columns)


    # --- Populate the DataFrame with new data ---

    # 1. Handle numerical features
    if 'do_tuoi' in processed_df_new.columns:
         processed_df_new['do_tuoi'] = raw_input_data.do_tuoi

    # 2. Handle date/time extraction
    try:
        input_datetime = raw_input_data.thoi_gian
        if 'thang' in processed_df_new.columns:
             processed_df_new['thang'] = input_datetime.month
        if 'ngay_trong_tuan' in processed_df_new.columns:
             processed_df_new['ngay_trong_tuan'] = input_datetime.weekday() # 0=Mon, 6=Sun
        if 'nam' in processed_df_new.columns:
             processed_df_new['nam'] = input_datetime.year
    except Exception as e:
        # Log warning but allow processing to continue with default 0s if date extraction fails
        logger.warning(f"Could not extract date/time features from input: {e}. Time features will be 0.")


    # 3. Handle categorical features (store normalized strings initially)
    if 'gioi_tinh' in processed_df_new.columns:
        processed_df_new['gioi_tinh'] = normalize_string(raw_input_data.gioi_tinh)
    if 'dia_diem' in processed_df_new.columns:
        processed_df_new['dia_diem'] = normalize_string(raw_input_data.dia_diem)

    # Note: 'thang' and 'ngay_trong_tuan' populated above, will be converted to category below.


    # 4. Handle multi-label features (symptoms, risks) - initialized to 0, set to 1 for present items
    normalized_symptoms = parse_and_normalize_list_string(raw_input_data.trieu_chung)
    normalized_risks = parse_and_normalize_list_string(raw_input_data.yeu_to_nguy_co)

    # Find the exact column names expected by the model based on loaded info
    symptom_cols_expected = [col for col in training_columns if col.startswith('symptom_')]
    risk_cols_expected = [col for col in training_columns if col.startswith('risk_')]

    # Map normalized input items to expected column names that actually exist in training columns
    symptom_cols_to_set_1 = [f'symptom_{symptom_key}' for symptom_key in normalized_symptoms if f'symptom_{symptom_key}' in symptom_cols_expected]
    risk_cols_to_set_1 = [f'risk_{risk_key}' for risk_key in normalized_risks if f'risk_{risk_key}' in risk_cols_expected]

    # Set the value to 1 for the columns that are present in the input and expected by the model
    # Use .loc[:, col_list] to ensure assignment works correctly
    if symptom_cols_to_set_1:
         processed_df_new.loc[0, symptom_cols_to_set_1] = 1
    if risk_cols_to_set_1:
         processed_df_new.loc[0, risk_cols_to_set_1] = 1


    # --- Ensure dtypes match training data for ALL columns ---
    # Iterate through training columns and apply saved dtypes and categories
    for col in training_columns:
         expected_dtype_str = training_dtypes_map.get(col)

         if expected_dtype_str == 'category':
              categories_for_col = training_categories_map.get(col)

              if categories_for_col is not None and len(categories_for_col) > 0:
                   try:
                        # Use pd.Categorical with the explicit list of categories from training
                        # Values not in categories_for_col will become NaN
                        current_value = processed_df_new[col].iloc[0] # Get the single value
                        # Wrap the single value in a list for pd.Categorical
                        processed_df_new[col] = pd.Categorical([current_value], categories=categories_for_col, ordered=False)
                        if processed_df_new[col].isna().any():
                             # Log warning if the *input value itself* resulted in NaN after conversion
                             # Note: if the column wasn't populated (e.g., 'thang' extraction failed), it would already be 0
                             # which might not be in categories and become NaN here. This is expected if input is bad/missing.
                             logger.warning(f"Input value '{current_value}' for categorical column '{col}' not found in training categories. Treated as NaN.")
                   except Exception as e:
                        # Catch errors during Categorical conversion (e.g., unexpected input format)
                        logger.warning(f"Could not convert column '{col}' to dtype 'category' using loaded categories: {e}. Column might have wrong dtype.", exc_info=True)
              else:
                   # This case might happen if a category column in training had 0 unique values, or if info was incomplete
                   logger.warning(f"Categories for column '{col}' not found or empty in loaded info. Cannot ensure correct 'category' dtype.")
                   # Attempt basic conversion to category without specific list, may fail on unseen or create new categories
                   # XGBoost native categorical might handle this, but relying on loaded categories is safer.
                   try:
                        # Convert to string first to avoid issues with numerical categories like month becoming NaN
                        processed_df_new[col] = processed_df_new[col].astype(str).astype('category')
                        logger.warning(f"Attempted basic conversion of '{col}' to 'category'. Unseen values might be an issue.")
                   except Exception as inner_e:
                         logger.warning(f"Basic attempt to convert '{col}' to 'category' failed: {inner_e}. Keeping current dtype.", exc_info=True)


         elif expected_dtype_str in ['int64', 'float64', 'int32', 'int']: # Numerical columns
              try:
                  # Attempt conversion. Errors could happen if input was non-numeric but expected numeric.
                  processed_df_new[col] = processed_df_new[col].astype(expected_dtype_str)
              except Exception as e:
                  logger.warning(f"Could not set numerical column '{col}' to expected dtype '{expected_dtype_str}': {e}. Column might have wrong dtype.", exc_info=True)

         # symptom_* and risk_* columns are already int/int64 from initialization/population


    # Ensure the column order matches the training data exactly.
    # This step is important for XGBoost, although initialization helps.
    # Use reindex, filling with 0 for new columns (shouldn't happen if training_columns is correct)
    processed_df_new_aligned = processed_df_new.reindex(columns=training_columns, fill_value=0)

    # Final check on dtypes after reindexing (optional but good for debugging)
    # for col in training_columns:
    #      expected_dtype_str = training_dtypes_map.get(col)
    #      if processed_df_new_aligned[col].dtype.name != expected_dtype_str and not (expected_dtype_str == 'category' and isinstance(processed_df_new_aligned[col].dtype, pd.CategoricalDtype)):
    #          logger.warning(f"Column '{col}' dtype mismatch after reindex. Expected '{expected_dtype_str}', got '{processed_df_new_aligned[col].dtype.name}'.")


    # --- Add debug logging after final alignment ---
    logger.debug(f"Processed input data shape after final alignment: {processed_df_new_aligned.shape}")
    logger.debug(f"Processed input data dtypes after final alignment:\n {processed_df_new_aligned.dtypes.value_counts()}")
    # logger.debug(f"Processed input data head after final alignment:\n {processed_df_new_aligned.head()}") # Head is just one row


    return processed_df_new_aligned


# --- Initialize FastAPI ---
app = FastAPI(
    title="Disease Prediction API",
    description="API for predicting top K diseases with probabilities",
    version="1.0.0"
)

# --- Load Model and Preprocessing Objects on Startup ---
model = None
label_encoder = None
mlb_symptoms = None
mlb_risks = None
processed_feature_info = None
encoded_to_original_label_map = None
all_symptoms_list = None
all_risk_factors_list = None

# Use a flag to indicate if loading was successful
loading_successful = False
try:
    (model, label_encoder, mlb_symptoms, mlb_risks,
     processed_feature_info, encoded_to_original_label_map,
     all_symptoms_list, all_risk_factors_list) = load_model_and_preprocessing_objects(model_dir)
    loading_successful = True
except (FileNotFoundError, Exception) as e:
    # Error is already logged in load_model_and_preprocessing_objects
    logger.critical(f"API failed to load model and preprocessing objects: {e}")
    # Keep loading_successful as False

# --- Endpoints ---

@app.get("/")
async def root():
    """Kiểm tra trạng thái API và tải model"""
    logger.info("Root endpoint accessed")
    if not loading_successful:
         # Return 503 Service Unavailable if loading failed
         raise HTTPException(status_code=503, detail="Model and preprocessing objects failed to load. API is not ready for predictions. Check API logs for details.")
    return {"status": "ok", "message": "Disease Prediction API is running and model is loaded."}

@app.get("/diseases_and_features")
async def get_diseases_and_features():
    """Trả về danh sách tất cả bệnh, triệu chứng và yếu tố nguy cơ đã nhận diện"""
    if not loading_successful:
        logger.warning("Attempted to access /diseases_and_features but preprocessing objects not loaded.")
        raise HTTPException(status_code=503, detail="Model or preprocessing information not loaded. API is not ready.")

    try:
        # Get unique original disease names from the label map, sorted by encoded index
        # Handle cases where encoded index might not be in map (fallback to Unknown)
        all_diseases_original = [encoded_to_original_label_map.get(i, f"Unknown_{i}") for i in sorted(encoded_to_original_label_map.keys())]


        logger.info("Diseases, symptoms, and risk factors retrieved.")
        return {
            "diseases_original_names": all_diseases_original,
            "unique_symptoms_normalized": all_symptoms_list, # Return normalized keys
            "unique_risk_factors_normalized": all_risk_factors_list # Return normalized keys
        }
    except Exception as e:
        logger.error(f"Error retrieving diseases/features: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error retrieving diseases or features: {str(e)}")


@app.post("/predict")
async def predict_disease_endpoint(input_data: PatientInput):
    """
    Dự đoán top K bệnh có khả năng nhất với phần trăm xác suất dựa trên thông tin bệnh nhân.
    Input: Thông tin bệnh nhân (gioi_tinh, do_tuoi, dia_diem, thoi_gian, trieu_chung, yeu_to_nguy_co, top_k).
    Output: Danh sách top K bệnh và xác suất.
    """
    if not loading_successful:
        logger.warning("Prediction requested but model or preprocessing objects not loaded.")
        raise HTTPException(status_code=503, detail="Model or preprocessing information not loaded. API is not ready for predictions. Check API logs for details.")

    requested_top_k = max(1, input_data.top_k) # Ensure top_k is at least 1

    logger.info(f"Received prediction request: top_k={requested_top_k} for patient Age={input_data.do_tuoi}, Gender={input_data.gioi_tinh}, Location={input_data.dia_diem}, Time={input_data.thoi_gian.date()}")


    # --- Preprocess Input Data ---
    processed_input_df = None # Initialize to None
    try:
        processed_input_df = preprocess_new_data(
            raw_input_data=input_data,
            mlb_symptoms=mlb_symptoms,
            mlb_risks=mlb_risks,
            processed_feature_info=processed_feature_info # Includes categories now
        )
        logger.info(f"Successfully preprocessed input data. Shape: {processed_input_df.shape}")

        # Verify feature count against the model's expectation
        if hasattr(model, 'n_features_in_'):
             expected_features = model.n_features_in_
             if processed_input_df.shape[1] != expected_features:
                  logger.error(f"Feature count mismatch after preprocessing. Expected {expected_features}, got {processed_input_df.shape[1]}.")
                  # Log processed columns vs expected columns if needed for debugging
                  # logger.error(f"Processed input columns: {processed_input_df.columns.tolist()}")
                  # if processed_feature_info and 'columns' in processed_feature_info:
                  #      logger.error(f"Expected training columns: {processed_feature_info['columns']}")
                  # It's a critical error if feature count is wrong
                  raise HTTPException(status_code=500, detail=f"Preprocessing error: Feature count mismatch. Please check preprocessing logic ({processed_input_df.shape[1]} vs {expected_features}).")
        else:
             logger.warning("Model does not have 'n_features_in_'. Cannot verify feature count.")


    except ValueError as ve:
         logger.error(f"Preprocessing error (ValueError): {str(ve)}", exc_info=True)
         raise HTTPException(status_code=400, detail=f"Lỗi tiền xử lý dữ liệu đầu vào: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected preprocessing error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Lỗi tiền xử lý dữ liệu đầu vào không mong muốn: {str(e)}")

    # --- Predict Probabilities ---
    if processed_input_df is None: # Should not happen if exceptions are raised above, but safe check
         logger.error("Processed input DataFrame is None before prediction.")
         raise HTTPException(status_code=500, detail="Internal server error: Preprocessing failed unexpectedly.")

    try:
        # Predict probabilities
        # The sklearn API (XGBClassifier) automatically uses the best_iteration found by the callback.
        y_proba = model.predict_proba(processed_input_df) # Shape (1, n_classes)

        if y_proba.ndim != 2 or y_proba.shape[0] != 1:
             logger.error(f"Unexpected prediction output shape from model: {y_proba.shape}. Expected (1, n_classes).")
             raise HTTPException(status_code=500, detail=f"Lỗi định dạng đầu ra từ model: {y_proba.shape}")

        probabilities = y_proba[0] # Get the probabilities for the single sample


        # --- Get Top K Predictions ---
        # Get the list of valid encoded indices from the loaded map
        valid_encoded_indices = sorted(encoded_to_original_label_map.keys())
        n_classes = len(valid_encoded_indices)

        # Adjust requested_top_k if it's more than the number of classes
        if n_classes < requested_top_k:
            logger.warning(f"Requested top_k={requested_top_k} but only {n_classes} classes available. Returning all {n_classes}.")
            requested_top_k = n_classes

        # Get indices of top K probabilities (highest to lowest)
        # Ensure we only consider indices corresponding to valid classes in our map
        # (though with LabelEncoder, all model output indices should be valid if map is complete)
        # Sort indices based on probabilities
        sorted_indices_full = np.argsort(probabilities)[::-1]

        # Filter and select the top K indices that are present in our valid map keys
        top_k_indices = [idx for idx in sorted_indices_full if idx in encoded_to_original_label_map][:requested_top_k]

        # If, rarely, we couldn't get enough indices from the map, fill up to requested_top_k if possible
        # This loop is a safeguard, unlikely needed if map is complete and covers all classes 0..n_classes-1
        while len(top_k_indices) < requested_top_k and len(top_k_indices) < n_classes:
             added_count = len(top_k_indices)
             for idx_candidate in sorted_indices_full:
                  if idx_candidate not in top_k_indices and idx_candidate in encoded_to_original_label_map:
                       top_k_indices.append(idx_candidate)
                       if len(top_k_indices) == requested_top_k:
                            break # Stop once we have enough
             # If we didn't add any new indices in this pass, break to avoid infinite loop
             if len(top_k_indices) == added_count:
                  logger.warning(f"Could not find enough valid indices in encoded_to_original_label_map to fill requested top_k. Stopping.")
                  break


        # Map indices to original disease names and get probabilities
        top_k_predictions = []
        for idx in top_k_indices:
            # Use .get for safety, providing a fallback name
            disease_original_name = encoded_to_original_label_map.get(idx, f"Unknown_Index_{idx}")
            probability = probabilities[idx]
            top_k_predictions.append({
                "disease": disease_original_name,
                "probability_percentage": round(float(probability * 100), 2) # Convert to percentage, round
            })

        # Sort predictions by probability descending (redundant but ensures order)
        top_k_predictions = sorted(top_k_predictions, key=lambda x: x['probability_percentage'], reverse=True)


        logger.info(f"Prediction successful. Top {requested_top_k} diseases identified.")

        response = {
            "top_predictions": top_k_predictions,
            "requested_top_k": requested_top_k,
            "total_classes": n_classes, # Include total classes for context
            "message": "Dự đoán thành công"
        }
        return response

    except Exception as e:
        logger.error(f"Prediction or result formatting error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Lỗi khi thực hiện hoặc xử lý kết quả dự đoán: {str(e)}")


# --- Uvicorn Entry Point ---
if __name__ == "__main__":
    # Ensure the model directory exists before trying to load
    if not os.path.exists(model_dir):
         logger.critical(f"Model directory '{model_dir}' not found. Please run the preprocessing script first.")
         # The load_model_and_preprocessing_objects function will raise an exception
         # which will be caught by the main loading block, preventing the API from starting.
         # Optionally create the dir if you just want the API to start but fail predictions:
         # os.makedirs(model_dir, exist_ok=True)

    import uvicorn
    # To run from the model3 directory, if main.py is inside model3:
    # uvicorn main:app --reload --host 0.0.0.0 --port 8000
    # If you run from the parent directory and model3 is a package:
    # uvicorn model3.main:app --reload --host 0.0.0.0 --port 8000
    # Use __name__ to refer to the current file
    uvicorn.run(__name__ + ":app", host="0.0.0.0", port=8000, reload=True)