import pandas as pd
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Path dataset
data_path = "../notebooks/data/processed_data.csv"

# Cek apakah file ada
if not os.path.exists(data_path):
    raise FileNotFoundError(f"File {data_path} tidak ditemukan.")

# Cek apakah file kosong
if os.path.getsize(data_path) == 0:
    raise ValueError(f"File {data_path} kosong.")


# Load dataset
df = pd.read_csv(data_path)

# Pastikan dataset tidak kosong
if df.empty:
    raise ValueError("Dataset kosong setelah preprocessing.")

# Pisah fitur dan target
X = df.drop(columns=["Laba_Rugi"])  # Semua kecuali target
y = df["Laba_Rugi"]

# Bagi dataset menjadi train dan test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Pilih model Machine Learning
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Latih model dengan data training
model.fit(X_train, y_train)

# Evaluasi model dengan data testing
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Model trained successfully!")
print(f"MAE: {mae:.4f}, MSE: {mse:.4f}, R²: {r2:.4f}")

# Simpan model
model_dir = "../models"
os.makedirs(model_dir, exist_ok=True)  # Pastikan folder ada
model_path = os.path.join(model_dir, "trained_model.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print(f"Model disimpan di '{model_path}'")
