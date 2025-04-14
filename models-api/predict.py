import requests
import json

# URL API Flask 
url = 'http://127.0.0.1:5000/predict'

# Data input yang ingin diprediksi
input_data = {
    "model": "regresi",  
    "fitur": {
        "User_ID": 1,
        "Bidang_Usaha": "Perdagangan",
        "Tahun": 2024,
        "Bulan": 6,
        "Pendapatan": 15000000,
        "Beban_Operasional": 5000000,
        "Pajak": 1000000
    }
}

# Kirim request POST
response = requests.post(url, json=input_data)

# Tampilkan hasil
if response.status_code == 200:
    result = response.json()
    print("Prediksi berhasil:")
    print("Hasil prediksi:", result["prediksi"])
    print("Keterangan:", result["label"])
else:
    print("Terjadi error:")
    print(response.status_code, response.text)
