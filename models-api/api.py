from flask import Blueprint, request, jsonify, send_file
import pickle
import os
import gdown
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import json
import pandas as pd
from io import BytesIO


api = Blueprint('api', __name__)

#MongoDB setup
client = MongoClient("mongodb+srv://my-akuntan-admin:AdminMyAkuntan@cluster0.zf5zg.mongodb.net/umkm_db?retryWrites=true&w=majority&appName=Cluster0")
db = client["umkm_db"]
collection = db["laporanlabarugis"]

# Load model & encoder
model_regresi = pickle.load(open('./models-api/trained_model.pkl', 'rb'))
model_time_series = pickle.load(open('./models-api/timeseries_pipeline_model.pkl', 'rb'))
encoder_regresi = pickle.load(open('./models-api/label_encoders.pkl', 'rb'))
encoder_timeseries = pickle.load(open('./models-api/time_series_encoders.pkl', 'rb'))

features_regresi = ["User_ID", "Bidang_Usaha", "Tahun", "Bulan", "Pendapatan", "Beban_Operasional", "Pajak"]
features_timeseries = ["Bidang_Usaha", "Tahun", "Bulan", "Pendapatan", "Beban_Operasional", "Pajak", "Laba_Rugi_Lag"]

def interpret_output(value):
    return "Laba" if value >= 0 else "Rugi"


# Encoder untuk JSON yang bisa handle ObjectId
class JsonEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)


#====================ROUTES==========================
# @api.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     model_type = data.get("model")
#     fitur_input = data.get("fitur")

#     if not model_type or not fitur_input:
#         return jsonify({"error": "Model dan fitur harus disediakan"}), 400

#     try:
#         if model_type == "regresi":
#             input_data = [fitur_input[feat] for feat in features_regresi]
#             input_data[1] = encoder_regresi["Bidang_Usaha"].transform([input_data[1]])[0]
#             pred = model_regresi.predict([input_data])[0]
#         elif model_type == "time_series":
#             input_data = [fitur_input[feat] for feat in features_timeseries]
#             input_data[0] = encoder_timeseries["Bidang_Usaha"].transform([input_data[0]])[0]
#             pred = model_time_series.predict([input_data])[0]
#         else:
#             return jsonify({"error": "Model harus 'regresi' atau 'time_series'"}), 400

#         hasil = interpret_output(pred)
        
#         #simpan ke Mongoo
#         fitur_input["model"] = model_type
#         fitur_input["hasil_prediksi"] = hasil
#         fitur_input["nilai_prediksi"] = float(pred)
#         fitur_input["timestamp"] = datetime.now()
#         collection.insert_one(fitur_input)

#         return jsonify({"hasil_prediksi": hasil, "nilai_prediksi": float(pred)})

#     except Exception as e:
#         return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@api.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Dapatkan data JSON yang dikirimkan
    
    if isinstance(data, list):
        return jsonify({"error": "Data tidak valid, seharusnya berupa object (JSON) bukan list"}), 400

    model_type = data.get("model")
    fitur_input = data.get("fitur")

    if not model_type or not fitur_input:
        return jsonify({"error": "Model dan fitur harus disediakan"}), 400

    # Pastikan fitur_input memiliki semua kolom yang diperlukan
    required_columns = ["Bidang_Usaha", "Tahun", "Bulan", "Pendapatan", "Beban_Operasional", "Pajak", "Laba_Rugi_Lag"]
    missing_columns = [col for col in required_columns if col not in fitur_input]
    if missing_columns:
        return jsonify({"error": f"Fitur yang diperlukan tidak lengkap: {', '.join(missing_columns)}"}), 400

    try:
        # Menggunakan model regresi
        if model_type == "regresi":
            input_data = [fitur_input[feat] for feat in features_regresi]
            input_data[1] = encoder_regresi["Bidang_Usaha"].transform([input_data[1]])[0]
            pred = model_regresi.predict([input_data])[0]

        # Menggunakan model time series
        elif model_type == "time_series":
            input_data = [fitur_input[feat] for feat in features_timeseries]
            input_data[0] = encoder_timeseries["Bidang_Usaha"].transform([input_data[0]])[0]
            pred = model_time_series.predict([input_data])[0]

        else:
            return jsonify({"error": "Model harus 'regresi' atau 'time_series'"}), 400

        # Menginterpretasikan hasil prediksi
        hasil = interpret_output(pred)

        # Menyimpan hasil ke MongoDB
        fitur_input["model"] = model_type
        fitur_input["hasil_prediksi"] = hasil
        fitur_input["nilai_prediksi"] = float(pred)
        fitur_input["timestamp"] = datetime.now()
        collection.insert_one(fitur_input)

        # Mengembalikan hasil prediksi dalam response
        return jsonify({"hasil_prediksi": hasil, "nilai_prediksi": float(pred)})

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500


def interpret_output(prediction):
    # Misalnya, jika prediksi lebih besar dari 0, itu berarti "Laba", jika tidak, "Rugi"
    return "Laba" if prediction > 0 else "Rugi"




#History Laba Rugi
@api.route('/historylabarugis', methods=['GET'])
def get_historylaporanlabarugis():
    try:
        # Ambil query filter
        tahun = request.args.get('tahun')
        bulan = request.args.get('bulan')
        user_id = request.args.get('user_id')

        # Pagination
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit

        # Filter query
        filter_query = {}
        if tahun:
            filter_query["Tahun"] = int(tahun)
        if bulan:
            filter_query["Bulan"] = int(bulan)
        if user_id:
            filter_query["User_ID"] = user_id

        # Ambil data dari MongoDB
        sort_by = request.args.get('sort_by', 'timestamp')
        order = int(request.args.get('order', -1))  # -1 = desc, 1 = asc

        cursor = collection.find(filter_query).sort(sort_by, order).skip(skip).limit(limit)

        laporan = []
        total_laba = 0
        total_rugi = 0
        total_nilai_prediksi = 0.0

        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            if "timestamp" in doc:
                doc["timestamp"] = doc["timestamp"].isoformat()

            # Hitung ringkasan
            total_nilai_prediksi += doc.get("nilai_prediksi", 0)
            if doc.get("hasil_prediksi") == "Laba":
                total_laba += 1
            elif doc.get("hasil_prediksi") == "Rugi":
                total_rugi += 1

            laporan.append(doc)

        total_data = collection.count_documents(filter_query)

        return jsonify({
            "total_data": total_data,
            "page": page,
            "limit": limit,
            "total_laba": total_laba,
            "total_rugi": total_rugi,
            "total_nilai_prediksi": total_nilai_prediksi,
            "laporan": laporan
        })
        

    except Exception as e:
        return jsonify({"error": f"Gagal mengambil riwayat: {str(e)}"}), 500

# CONTOH PEMAKAIAN
# /historylaporanlabarugis?tahun=2025&bulan=4&page=1&limit=5
# >sort by nilai_prediksi terbesar: http://localhost:5000/historylabarugis?sort_by=nilai_prediksi&order=-1
# >sort by nilai_prediksi terkecil: http://localhost:5000/historylabarugis?sort_by=nilai_prediksi&order=1
# >kombinasi dengan filter: http://localhost:5000/historylabarugis?tahun=2025&bulan=4&sort_by=nilai_prediksi&order=-1




#Export ke excel
@api.route('/exportlaporan', methods=['GET'])
def export_laporan():
    try:
        tahun = request.args.get('tahun')
        bulan = request.args.get('bulan')
        user_id = request.args.get('user_id')

        # Buat filter
        filter_query = {}
        if tahun:
            filter_query["Tahun"] = int(tahun)
        if bulan:
            filter_query["Bulan"] = int(bulan)
        if user_id:
            filter_query["User_ID"] = user_id

        # Ambil data dari MongoDB
        data = list(collection.find(filter_query))
        if not data:
            return jsonify({"message": "Data kosong"}), 404

        # Bersihkan data
        for doc in data:
            doc["_id"] = str(doc["_id"])
            if "timestamp" in doc:
                doc["timestamp"] = doc["timestamp"].isoformat()

        # Convert ke DataFrame
        df = pd.DataFrame(data)

        # Simpan ke Excel dalam memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='RiwayatPrediksi')

        output.seek(0)

        return send_file(
            output,
            download_name="riwayat_prediksi.xlsx",
            as_attachment=True,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

    except Exception as e:
        return jsonify({"error": f"Gagal export: {str(e)}"}), 500

# DOWNLOAD
# fetch('http://localhost:5000/exportlaporan')
#   .then(response => response.blob())
#   .then(blob => {
#     const url = window.URL.createObjectURL(blob);
#     const link = document.createElement('a');
#     link.href = url;
#     link.download = 'riwayat_prediksi.xlsx';
#     link.click();
#   });



# if __name__ == '__main__':
#     app.run(debug=True)