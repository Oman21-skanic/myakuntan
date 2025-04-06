import pandas as pd
import pickle
import os
import numpy as np

# 1. Load model & label encoder
current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, "../models", "trained_model.pkl")
encoder_path = os.path.join(current_dir, "../models", "label_encoders.pkl")

if not os.path.exists(model_path):
    raise FileNotFoundError("Model tidak ditemukan.")
if not os.path.exists(encoder_path):
    raise FileNotFoundError("Label encoder tidak ditemukan.")

with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(encoder_path, "rb") as f:
    label_encoders = pickle.load(f)

# 2. Contoh input baru (bisa kamu ubah sesuai data nyata)
input_dict = {
    "User_ID": 1,                # numeric
    "Bidang_Usaha": "Perdagangan",    # kolom kategori
    "Tahun": 2024,                    # numeric
    "Bulan": 6,                   # numeric
    "Pendapatan": 15000000,          # numeric
    "Beban_Operasional": 5000000,   # numeric
    "Pajak": 1000000,             # numeric
}

# 3. Konversi input ke DataFrame
input_df = pd.DataFrame([input_dict])

# 4. Encode kolom kategorikal
for col, le in label_encoders.items():
    if col in input_df.columns:
        input_df[col] = le.transform(input_df[col])

# 5. Prediksi
prediction = model.predict(input_df)[0]
print(f"📈 Prediksi Laba/Rugi: Rp {prediction:,.2f}")
