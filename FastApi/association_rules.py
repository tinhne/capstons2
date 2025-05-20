import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from tqdm import tqdm

# Đọc dataset
print("🔹 Đang đọc dataset...")
df = pd.read_csv('Final_Augmented_dataset_Diseases_and_Symptoms.csv')  # Thay bằng đường dẫn file
print(f"✅ Đã đọc dataset: {df.shape[0]} dòng, {df.shape[1]} cột")

# Loại bỏ cột 'diseases' để chỉ lấy triệu chứng
symptom_df = df.drop(columns=['diseases'])

# Chuyển đổi sang kiểu bool
symptom_df = symptom_df.astype(bool)
print("🔹 Đã chuyển đổi sang kiểu bool")

# Tìm các tập hợp triệu chứng phổ biến
print("🔹 Đang tạo luật kết hợp...")
frequent_itemsets = apriori(symptom_df, min_support=0.005, use_colnames=True)

# Tạo luật kết hợp
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)

# Sắp xếp theo confidence và lift
rules = rules.sort_values(['confidence', 'lift'], ascending=[False, False])

# Lưu luật kết hợp vào file CSV
output_path = 'symptom_association_rules.csv'
rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].to_csv(output_path, index=False)
print(f"✅ Đã lưu luật kết hợp tại: {output_path}")

# Hàm gợi ý triệu chứng
def suggest_symptoms(input_symptoms, rules, top_n=5):
    suggestions = []
    for _, rule in rules.iterrows():
        antecedents = set(rule['antecedents'])
        if set(input_symptoms).issubset(antecedents) or set(input_symptoms).intersection(antecedents):
            consequents = set(rule['consequents'])
            suggestions.extend(consequents - set(input_symptoms))
    suggestions = list(set(suggestions))[:top_n]
    return suggestions

# Ví dụ sử dụng
input_symptoms = ['fever', 'cough']
suggestions = suggest_symptoms(input_symptoms, rules)
print(f"Triệu chứng đầu vào: {input_symptoms}")
print(f"Gợi ý triệu chứng: {suggestions}")