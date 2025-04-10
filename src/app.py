import streamlit as st
import pandas as pd
import numpy as np
import pickle
import os

# === Load Model Regresi Sederhana ===
@st.cache_resource
def load_regresi_model():
    with open("../models/trained_model.pkl", "rb") as f:
        return pickle.load(f)

# === Load Label Encoder ===
@st.cache_resource
def load_encoders():
    with open("../models/label_encoders.pkl", "rb") as f:
        return pickle.load(f)

# === Load Time Series Pipeline ===
@st.cache_resource
def load_time_series_model():
    with open("../models/timeseries_pipeline_model.pkl", "rb") as f:
        return pickle.load(f)

# Load semua komponen
model_regresi = load_regresi_model()
label_encoders = load_encoders()
model_timeseries = load_time_series_model()

# === UI ===
st.title("📊 Prediksi Laba/Rugi UMKM")
st.markdown("Masukkan data transaksi untuk memprediksi hasil laba/rugi berdasarkan model yang dipilih.")

# Pilih model
model_type = st.radio("Pilih Model", ["Regresi Sederhana", "Time Series"])

# Input umum
user_id = st.number_input("User ID", min_value=1, step=1)
bidang_usaha = st.selectbox("Bidang Usaha", ["Jasa", "Manufaktur", "Perdagangan"])
tahun = st.selectbox("Tahun", list(range(2015, 2026)))
bulan = st.selectbox("Bulan", list(range(1, 13)))
pendapatan = st.number_input("Pendapatan (Rp)", min_value=0)
beban_operasional = st.number_input("Beban Operasional (Rp)", min_value=0)
pajak = st.number_input("Pajak (Rp)", min_value=0)

# Input khusus untuk Time Series
if model_type == "Time Series":
    laba_rugi_lag = st.number_input("Laba Rugi Bulan Sebelumnya", value=0.0)

# Tombol Prediksi
if st.button("🔍 Prediksi Laba/Rugi"):

    if model_type == "Regresi Sederhana":
        # Encode bidang usaha dengan LabelEncoder
        bidang_encoded = label_encoders["Bidang_Usaha"].transform([bidang_usaha])[0]

        input_data = pd.DataFrame([{
            "User_ID": user_id,
            "Bidang_Usaha": bidang_encoded,
            "Tahun": tahun,
            "Bulan": bulan,
            "Pendapatan": pendapatan,
            "Beban_Operasional": beban_operasional,
            "Pajak": pajak
        }])

        pred = model_regresi.predict(input_data)[0]

    else:
        # Time Series pakai pipeline otomatis (sudah handle one-hot dan impute)
        input_data = pd.DataFrame([{
            "Bidang_Usaha": bidang_usaha,
            "Tahun": tahun,
            "Bulan": bulan,
            "Pendapatan": pendapatan,
            "Beban_Operasional": beban_operasional,
            "Pajak": pajak,
            "Laba_Rugi_Lag": laba_rugi_lag
        }])

        pred = model_timeseries.predict(input_data)[0]

    # Format output
    formatted_result = f"Rp {pred:,.2f}".replace(",", ".")
    st.success(f"📈 Prediksi Laba/Rugi: {formatted_result}")
    
# === Load Evaluasi Metrics ===
@st.cache_resource
def load_metrics():
    with open("../models/evaluation_metrics.pkl", "rb") as f:
        return pickle.load(f)

metrics = load_metrics()