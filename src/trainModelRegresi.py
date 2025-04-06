import pandas as pd
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder

# 1. Load dataset
data_path = "data/dataset_laba_rugi_10th.csv"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"File tidak ditemukan: {data_path}")

df = pd.read_csv(data_path)

# 2. Encode kolom kategorikal (string) ke numerik
label_encoders = {}
for col in df.select_dtypes(include=['object']).columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# 3. Pisahkan fitur dan target
X = df.drop(columns=["Laba_Rugi"])
y = df["Laba_Rugi"]

# 4. Split data (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 5. Inisialisasi & training model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluasi model
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("=== Evaluasi Model ===")
print(f"MAE : {mae:.4f}")
print(f"MSE : {mse:.4f}")
print(f"R²  : {r2:.4f}")

# 7. Simpan model dan encoder
model_path = "models/trained_model.pkl"
encoder_path = "models/label_encoders.pkl"
models_dir = "models"

# Cek dan buat folder jika belum ada
if not os.path.exists(models_dir):
    os.makedirs(models_dir)
    print(f"📁 Folder '{models_dir}' dibuat.")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

with open(encoder_path, "wb") as f:
    pickle.dump(label_encoders, f)

print(f"\n✅ Model berhasil disimpan di: {model_path}")
print(f"✅ LabelEncoder berhasil disimpan di: {encoder_path}")
