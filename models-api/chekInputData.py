import numpy as np
import pickle
from sklearn.preprocessing import OneHotEncoder

# Load encoder dan model yang sudah dilatih
with open("timeseries_pipeline_model.pkl", "rb") as f:
    pipeline = pickle.load(f)

# Contoh input data
input_data = {
    "User_ID": "USR001",
    "Bidang_Usaha": "Jasa",
    "Tahun": 2025,
    "Bulan": 5,
    "Pendapatan": 12000000,
    "Beban_Operasional": 5000000,
    "Pajak": 1000000,
    "Laba_Rugi_Lag": 3000000  # Hasil bulan sebelumnya
}

# Fitur yang diharapkan pada model
expected_columns = ["Bidang_Usaha", "Tahun", "Bulan", "Pendapatan", "Beban_Operasional", "Pajak", "Laba_Rugi_Lag"]

# Pastikan input_data memiliki kolom yang benar
input_features = [input_data[feature] for feature in expected_columns]

if len(input_features) != len(expected_columns):
    print(f"Jumlah fitur tidak sesuai: {len(input_features)} fitur ditemukan, tetapi {len(expected_columns)} fitur diharapkan.")
else:
    print("Jumlah fitur sudah sesuai.")

# Menyusun input data untuk proses encoding
categorical_features = ["Bidang_Usaha"]
encoder = pipeline.named_steps['preprocessor'].transformers_[0][1]  # Mendapatkan encoder dari pipeline

# Pastikan encoder mengenali kategori
try:
    encoded_bidang_usaha = encoder.transform([input_data["Bidang_Usaha"]])
    print(f"Encoded Bidang_Usaha: {encoded_bidang_usaha}")
except ValueError as e:
    print(f"Error encoding Bidang_Usaha: {str(e)}")

# Memastikan input sudah sesuai dengan preprocessing
processed_input = [input_data[feature] for feature in expected_columns]

# Cek apakah input bisa diproses oleh model tanpa error
try:
    prediction = pipeline.predict([processed_input])
    print(f"Prediksi berhasil: {prediction}")
except Exception as e:
    print(f"Terjadi kesalahan saat melakukan prediksi: {str(e)}")
