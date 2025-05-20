from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import xgboost as xgb
import numpy as np
from typing import List

app = FastAPI(title="Disease Prediction API")

# Định nghĩa model dữ liệu đầu vào
class SymptomsInput(BaseModel):
    symptoms: List[str]

def load_model_and_encoders():
    """Tải model, label encoder và danh sách triệu chứng"""
    try:
        model = xgb.Booster()
        model.load_model('model/xgboost_model.json')
        label_encoder = joblib.load('model/label_encoder.pkl')
        symptoms = joblib.load('model/all_symptoms.pkl')
        return model, label_encoder, symptoms
    except Exception as e:
        raise Exception(f"Lỗi khi tải mô hình: {str(e)}")

# Tải mô hình khi khởi động API
model, label_encoder, all_symptoms = load_model_and_encoders()

def prepare_input(symptoms_list: List[str], all_symptoms: List[str]) -> pd.DataFrame:
    """Chuẩn bị input từ danh sách triệu chứng"""
    input_data = pd.DataFrame(np.zeros((1, len(all_symptoms))), columns=all_symptoms)
    invalid_symptoms = []
    for symptom in symptoms_list:
        if symptom in all_symptoms:
            input_data[symptom] = 1
        else:
            invalid_symptoms.append(symptom)
    return input_data, invalid_symptoms

def predict_disease(model: xgb.Booster, label_encoder, input_data: pd.DataFrame) -> str:
    """Dự đoán bệnh từ input"""
    dmatrix = xgb.DMatrix(input_data)
    pred = model.predict(dmatrix)
    disease = label_encoder.inverse_transform([int(pred[0])])[0]
    return disease

@app.get("/")
async def root():
    """Endpoint kiểm tra API"""
    return {"message": "Disease Prediction API is running"}

@app.get("/symptoms")
async def get_symptoms():
    """Trả về danh sách tất cả triệu chứng"""
    return {"symptoms": all_symptoms}

@app.post("/predict")
async def predict_disease_endpoint(input_data: SymptomsInput):
    """Dự đoán bệnh dựa trên danh sách triệu chứng"""
    if not input_data.symptoms:
        raise HTTPException(status_code=400, detail="Danh sách triệu chứng không được rỗng")

    # Chuẩn bị dữ liệu đầu vào
    input_df, invalid_symptoms = prepare_input(input_data.symptoms, all_symptoms)

    # Dự đoán
    try:
        predicted_disease = predict_disease(model, label_encoder, input_df)
        response = {
            "predicted_disease": predicted_disease,
            "input_symptoms": input_data.symptoms,
            "invalid_symptoms": invalid_symptoms if invalid_symptoms else None,
            "message": "Dự đoán thành công" if not invalid_symptoms else "Một số triệu chứng không hợp lệ đã bị bỏ qua"
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi dự đoán: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)