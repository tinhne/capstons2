import pandas as pd

# Đọc file luật kết hợp
print("🔹 Đang đọc luật kết hợp...")
rules = pd.read_csv('symptom_association_rules.csv')
print(f"✅ Đã đọc {len(rules)} luật")

# Hàm gợi ý triệu chứng
def suggest_symptoms(input_symptoms, rules, top_n=5):
    suggestions = []
    for _, rule in rules.iterrows():
        antecedents = set(rule['antecedents'].strip("frozenset({})").replace("'", "").split(', '))
        consequents = set(rule['consequents'].strip("frozenset({})").replace("'", "").split(', '))
        # Kiểm tra nếu input_symptoms liên quan đến antecedents
        if set(input_symptoms).issubset(antecedents) or set(input_symptoms).intersection(antecedents):
            suggestions.extend(consequents - set(input_symptoms))
    # Loại bỏ trùng lặp và lấy top_n
    suggestions = list(set(suggestions))[:top_n]
    return suggestions

# Thử gợi ý cho 'fever, cough'
input_symptoms = ['fever', 'cough']
suggestions = suggest_symptoms(input_symptoms, rules)
print(f"Triệu chứng đầu vào: {input_symptoms}")
print(f"Gợi ý triệu chứng: {suggestions}")