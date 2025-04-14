from flask import Flask, request, jsonify
import pickle
# import numpy as np

# Inisialisasi Flask app
app = Flask(__name__)

# Load model & encoder
model_regresi = pickle.load(open('./models-api/trained_model.pkl', 'rb'))
model_time_series = pickle.load(open('./models-api/timeseries_pipeline_model.pkl', 'rb'))
encoder_regresi = pickle.load(open('./models-api/label_encoders.pkl', 'rb'))
encoder_timeseries = pickle.load(open('./models-api/time_series_encoders.pkl', 'rb'))

# Fitur sesuai urutan 
features_regresi = ["User_ID", "Bidang_Usaha", "Tahun", "Bulan", "Pendapatan", "Beban_Operasional", "Pajak"]
features_timeseries = ["Bidang_Usaha", "Tahun", "Bulan", "Pendapatan", "Beban_Operasional", "Pajak", "Laba_Rugi_Lag"]

# Fungsi bantu konversi output
def interpret_output(value):
    return "Laba" if value >= 0 else "Rugi"

# Route utama prediksi
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    model_type = data.get("model")  # "regresi" atau "time_series"
    fitur_input = data.get("fitur")

    if not model_type or not fitur_input:
        return jsonify({"error": "Model dan fitur harus disediakan"}), 400

    if model_type == "regresi":
        # Ambil fitur urut
        input_data = [fitur_input[feat] for feat in features_regresi]

        # Encode bidang usaha
        input_data[1] = encoder_regresi["Bidang_Usaha"].transform([input_data[1]])[0]

        # Prediksi
        pred = model_regresi.predict([input_data])[0]

    elif model_type == "time_series":
        try:
            input_data = [fitur_input[feat] for feat in features_timeseries]
            input_data[0] = encoder_timeseries["Bidang_Usaha"].transform([input_data[0]])[0]
            pred = model_time_series.predict([input_data])[0]
        except Exception as e:
            return jsonify({"error": f"Gagal memproses time series: {str(e)}"}), 400
    else:
        return jsonify({"error": "Model harus 'regresi' atau 'time_series'"}), 400

    hasil = interpret_output(pred)

    return jsonify({
        "hasil_prediksi": hasil,
        "nilai_prediksi": float(pred)
    })

if __name__ == '__main__':
    app.run(debug=True)

