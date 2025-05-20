from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd
import joblib
import xgboost as xgb
import numpy as np
import logging
import os

# Cấu hình logging
logging.basicConfig(
    filename='api.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Khởi tạo FastAPI
app = FastAPI(
    title="Disease Prediction API",
    description="API for predicting top 3 diseases with percentage probabilities and retrieving diseases/symptoms",
    version="1.0.0"
)

# Định nghĩa model dữ liệu đầu vào
class SymptomsInput(BaseModel):
    symptoms: List[str]

# Hàm tiện ích
def load_model_and_encoders():
    """Tải model, label encoder và danh sách triệu chứng"""
    try:
        model = xgb.Booster()
        model.load_model('model2/xgboost_model_1.json')
        label_encoder = joblib.load('model2/label_encoder_1.pkl')
        symptoms = joblib.load('model2/all_symptoms_1.pkl')
        logger.info("Model and encoders loaded successfully")
        logger.info(f"Number of classes: {len(label_encoder.classes_)}")
        return model, label_encoder, symptoms
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise Exception(f"Error loading model: {str(e)}")

def prepare_input(symptoms_list: List[str], all_symptoms: List[str]) -> tuple:
    """Chuẩn bị input từ danh sách triệu chứng"""
    input_data = pd.DataFrame(np.zeros((1, len(all_symptoms))), columns=all_symptoms)
    invalid_symptoms = []
    for symptom in symptoms_list:
        if symptom in all_symptoms:
            input_data[symptom] = 1
        else:
            invalid_symptoms.append(symptom)
    return input_data, invalid_symptoms

def predict_top_k_diseases(model: xgb.Booster, label_encoder, input_data: pd.DataFrame, k: int = 3) -> List[dict]:
    """Dự đoán top k bệnh với phần trăm xác suất"""
    dmatrix = xgb.DMatrix(input_data)
    try:
        probs = model.predict(
            dmatrix,
            output_margin=False,
            pred_leaf=False,
            pred_contribs=False,
            approx_contribs=False,
            pred_interactions=False,
            validate_features=True,
            training=False,
            iteration_range=(0, model.best_iteration + 1 if model.best_iteration else 0)
        )
        logger.info(f"Prediction probs shape: {probs.shape}, probs: {probs}")
        
        # Handle different output shapes
        if probs.ndim == 2:
            probs = probs[0]  # Single sample: take first row
        elif probs.ndim == 1:
            pass  # Already 1D array of probabilities
        else:
            raise ValueError(f"Unexpected probs shape: {probs.shape}")

        # Ensure probs has enough values for k
        if len(probs) < k:
            raise ValueError(f"Too few probabilities ({len(probs)}) for top {k} diseases")

        top_k_indices = np.argsort(probs)[-k:][::-1]
        top_k_diseases = [
            {
                "disease": label_encoder.inverse_transform([idx])[0],
                "percentage": round(float(probs[idx] * 100), 2)
            }
            for idx in top_k_indices
        ]
        return top_k_diseases
    except Exception as e:
        logger.error(f"Error in predict_top_k_diseases: {str(e)}")
        raise

# Tải mô hình khi khởi động
model, label_encoder, all_symptoms = load_model_and_encoders()

# Endpoints
@app.get("/")
async def root():
    """Kiểm tra API"""
    logger.info("Root endpoint accessed")
    return {"message": "Disease Prediction API is running"}

@app.get("/data")
async def get_data():
    """Trả về danh sách tất cả bệnh và triệu chứng"""
    diseases = label_encoder.classes_.tolist()
    logger.info("Data endpoint accessed: diseases and symptoms retrieved")
    return {
        "diseases": diseases,
        "symptoms": all_symptoms
    }

@app.post("/predict")
async def predict_disease_endpoint(input_data: SymptomsInput):
    """Dự đoán top 3 bệnh với phần trăm xác suất dựa trên danh sách triệu chứng"""
    if not input_data.symptoms:
        logger.warning("Empty symptoms list received")
        raise HTTPException(status_code=400, detail="Danh sách triệu chứng không được rỗng")

    # Chuẩn bị dữ liệu đầu vào
    input_df, invalid_symptoms = prepare_input(input_data.symptoms, all_symptoms)
    logger.info(f"Input data shape: {input_df.shape}, symptoms: {input_data.symptoms}")

    # Dự đoán
    try:
        top_k_diseases = predict_top_k_diseases(model, label_encoder, input_df, k=3)
        response = {
            "top_diseases": top_k_diseases,
            "input_symptoms": input_data.symptoms,
            "invalid_symptoms": invalid_symptoms if invalid_symptoms else None,
            "message": "Dự đoán thành công" if not invalid_symptoms else "Một số triệu chứng không hợp lệ đã bị bỏ qua"
        }
        logger.info(f"Predicted top diseases: {[d['disease'] for d in top_k_diseases]}")
        return response
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi dự đoán: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)