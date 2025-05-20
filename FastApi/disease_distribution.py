import pandas as pd

# Đọc dataset
print("🔹 Đang đọc dataset...")
df = pd.read_csv('Final_Augmented_dataset_Diseases_and_Symptoms.csv')  # Thay bằng đường dẫn file
print(f"✅ Đã đọc dataset: {df.shape[0]} dòng")

# Đếm số hàng của mỗi bệnh
disease_counts = df['diseases'].value_counts()
total_rows = df.shape[0]

# Tính tỷ lệ phần trăm
disease_dist = pd.DataFrame({
    'disease': disease_counts.index,
    'count': disease_counts.values,
    'percentage': (disease_counts.values / total_rows * 100).round(2)
})

# Sắp xếp theo số lượng giảm dần
disease_dist = disease_dist.sort_values('count', ascending=False)

# Lưu vào file CSV
output_path = 'disease_distribution.csv'
disease_dist.to_csv(output_path, index=False)
print(f"✅ Đã lưu phân bố bệnh tại: {output_path}")

# In top 5 bệnh phổ biến và hiếm
print("\n🔹 Top 5 bệnh phổ biến:")
print(disease_dist.head())
print("\n🔹 Top 5 bệnh hiếm:")
print(disease_dist.tail())