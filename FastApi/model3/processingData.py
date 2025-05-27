import pandas as pd
from sklearn.preprocessing import LabelEncoder
import json
import re

# 1. Đọc file CSV
df = pd.read_csv("model3/fake_logs.csv")

# 2. Làm sạch và chuẩn hóa triệu chứng
def clean_symptom_text(text):
    # Loại bỏ nội dung trong dấu ngoặc tròn
    text = re.sub(r"\([^)]*\)", "", text)
    # Chuẩn hóa: tách, strip và lower
    return [s.strip().lower() for s in text.split(",") if s.strip()]

df["symptoms"] = df["symptoms"].fillna("")
df["symptoms_list"] = df["symptoms"].apply(clean_symptom_text)

# 3. Tạo tập hợp tất cả triệu chứng duy nhất
all_symptoms = sorted(set(s for sublist in df["symptoms_list"] for s in sublist))

# 4. One-hot encoding cho triệu chứng
for symptom in all_symptoms:
    df[symptom] = df["symptoms_list"].apply(lambda x: int(symptom in x))

# 5. Mã hóa giới tính
gender_map = {"Nam": 0, "Nữ": 1}
df["gender_encoded"] = df["gender"].map(gender_map)

# 6. Mã hóa mùa
season_encoder = LabelEncoder()
df["season_encoded"] = season_encoder.fit_transform(df["season"])

# 7. Chọn các cột đặc trưng
feature_cols = ["age", "gender_encoded", "season_encoded"] + all_symptoms
X = df[feature_cols]

# 8. Mã hóa nhãn bệnh
label_encoder = LabelEncoder()
df["label"] = label_encoder.fit_transform(df["disease_name"])
y = df["label"]

# 9. Lưu dữ liệu đã chuẩn hóa
df_final = pd.concat([X, y.rename("disease_name_encoded")], axis=1)
df_final.to_csv("fakelog_processed.csv", index=False)

# 10. Lưu các bộ mã hóa để dùng lại sau khi train
with open("symptom_list.json", "w") as f:
    json.dump(all_symptoms, f)
joblib.dump(label_encoder, "label_encoder.pkl")
joblib.dump(season_encoder, "season_encoder.pkl")

print("✅ Chuẩn hóa xong. File lưu: fakelog_processed.csv")
