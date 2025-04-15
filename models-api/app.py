from flask import Flask
import gdown
import os

from api import api  

app = Flask(__name__)
app.register_blueprint(api, url_prefix='/api')  

# Unduh model jika belum ada
model_files = {
    "models-api/trained_model.pkl": "1HIPk5W5Ia8PRBDvmJWlDsaicxkxoPq06",
    "models-api/timeseries_pipeline_model.pkl": "1phGvaIjJiDwFok4ush9kRfdXL4hF84oS",
    "models-api/label_encoders.pkl": "10H__IvnotRcDvdcmbSjK7lZggl6F5_ro",
    "models-api/time_series_encoders.pkl": "11k172tkSHJ2TuR2ZXQud2vJW8J63h0Gj"
}

def download_if_missing():
    os.makedirs("models-api", exist_ok=True)
    for path, file_id in model_files.items():
        if not os.path.exists(path):
            print(f"Downloading {path}...")
            gdown.download(f"https://drive.google.com/uc?id={file_id}", path, quiet=False)

download_if_missing()

if __name__ == '__main__':
    app.run(debug=True)
