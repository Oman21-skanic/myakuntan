import pickle
import pandas as pd

# 1. Load pipeline model yang sudah dilatih
model_path = "models/timeseries_pipeline_model.pkl"
with open(model_path, "rb") as f:
    pipeline = pickle.load(f)

# 2. Buat input baru untuk prediksi
# Contoh data: ganti dengan input user dari UI/Streamlit nanti
input_data = {
    "User_ID": ["USR001"],
    "Bidang_Usaha": ["Jasa"],
    "Tahun": [2025],
    "Bulan": [5],
    "Pendapatan": [12000000],
    "Beban_Operasional": [5000000],
    "Pajak": [1000000],
    "Laba_Rugi_Lag": [3000000]  # Hasil bulan sebelumnya
}

# 3. Konversi ke DataFrame
df_input = pd.DataFrame(input_data)

# 4. Drop kolom User_ID (tidak diperlukan oleh model)
df_input_model = df_input.drop(columns=["User_ID"])

# 5. Prediksi
prediction = pipeline.predict(df_input_model)
print("\n📈 Prediksi Laba/Rugi Bulan Ini:")
print(f"Rp {prediction[0]:,.2f}")
