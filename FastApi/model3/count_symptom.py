import pandas as pd
import re

# Đọc file gốc (để lấy tên bệnh và triệu chứng thô)
df = pd.read_csv("model3/fake_logs.csv")

# Xử lý triệu chứng: chuẩn hóa và tách
def clean_symptom_text(text):
    text = re.sub(r"\([^)]*\)", "", str(text))  # loại bỏ trong dấu ngoặc
    return [s.strip().lower() for s in text.split(",") if s.strip()]

df["symptoms"] = df["symptoms"].fillna("")
df["symptoms_list"] = df["symptoms"].apply(clean_symptom_text)

# Lấy danh sách triệu chứng không trùng nhau
unique_symptoms = sorted(set(symptom for lst in df["symptoms_list"] for symptom in lst))

# Lấy danh sách bệnh không trùng nhau
unique_diseases = sorted(df["disease_name"].dropna().unique())

# In kết quả
print(f"✅ Số triệu chứng không trùng nhau: {len(unique_symptoms)}")
for s in unique_symptoms:
    print("🔹", s)

print(f"\n✅ Số bệnh không trùng nhau: {len(unique_diseases)}")
for d in unique_diseases:
    print("🦠", d)
