import pandas as pd
import os
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin

# ==== Custom Transformer untuk Encoding Label ====
class LabelEncoderTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.encoders = {}

    def fit(self, X, y=None):
        for col in X.select_dtypes(include='object').columns:
            le = LabelEncoder()
            le.fit(X[col])
            self.encoders[col] = le
        return self

    def transform(self, X):
        X_ = X.copy()
        for col, le in self.encoders.items():
            X_[col] = le.transform(X_[col])
        return X_

    def get_encoders(self):
        return self.encoders

# ==== Load dan siapkan dataset ====
data_path = "data/dataset_laba_rugi_10th.csv"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"File tidak ditemukan: {data_path}")

df = pd.read_csv(data_path)

# Urutkan berdasarkan User_ID, Tahun, Bulan (karena time-series)
df = df.sort_values(by=["User_ID", "Tahun", "Bulan"]).reset_index(drop=True)

# Tambahkan lag (nilai Laba_Rugi sebelumnya sebagai fitur)
df["Laba_Rugi_Lag"] = df.groupby("User_ID")["Laba_Rugi"].shift(1)
df.dropna(inplace=True)  # karena lag menghasilkan NaN di baris pertama tiap grup

# Pisahkan fitur dan target
features = ["Bidang_Usaha", "Tahun", "Bulan", "Pendapatan", "Beban_Operasional", "Pajak", "Laba_Rugi_Lag"]
X = df[features]
y = df["Laba_Rugi"]

# Split time-based (80% awal untuk train)
split_idx = int(len(X) * 0.8)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

# ==== Pipeline ====
pipeline = Pipeline([
    ("label_encoder", LabelEncoderTransformer()),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

# ==== Training ====
pipeline.fit(X_train, y_train)

# ==== Evaluasi ====
y_pred = pipeline.predict(X_test)
print("=== Evaluasi Model Time Series ===")
print(f"MAE : {mean_absolute_error(y_test, y_pred):,.2f}")
print(f"MSE : {mean_squared_error(y_test, y_pred):,.2f}")
print(f"R^2 : {r2_score(y_test, y_pred):.4f}")

# ==== Simpan Model dan Encoder ====
os.makedirs("models", exist_ok=True)
with open("models/time_series_pipeline.pkl", "wb") as f:
    pickle.dump(pipeline, f)

# Simpan encoder secara terpisah jika ingin digunakan untuk inferensi manual
encoder = pipeline.named_steps["label_encoder"].get_encoders()
with open("models/time_series_encoders.pkl", "wb") as f:
    pickle.dump(encoder, f)

print("\n✅ Model dan encoder time-series berhasil disimpan.")