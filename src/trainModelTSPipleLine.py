import pandas as pd
import os
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

# 1. Load dataset
data_path = "data/dataset_laba_rugi_10th.csv"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"File tidak ditemukan: {data_path}")

df = pd.read_csv(data_path)

# 2. Urutkan data berdasarkan User_ID, Tahun, Bulan
df = df.sort_values(by=["User_ID", "Tahun", "Bulan"]).reset_index(drop=True)

# 3. Tambahkan fitur lag Laba_Rugi bulan sebelumnya
df["Laba_Rugi_Lag"] = df.groupby("User_ID")["Laba_Rugi"].shift(1)
df = df.dropna().reset_index(drop=True)  # Buang baris yang lag-nya NaN

# 4. Pisahkan fitur dan target
X = df.drop(columns=["Laba_Rugi"])
y = df["Laba_Rugi"]

# 5. Definisikan fitur numerik dan kategorikal
categorical_features = ["Bidang_Usaha"]
numeric_features = ["Tahun", "Bulan", "Pendapatan", "Beban_Operasional", "Pajak", "Laba_Rugi_Lag"]

# 6. Buat preprocessor (encoding & impute)
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", SimpleImputer(strategy="mean"), numeric_features)
    ]
)

# 7. Buat pipeline
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

# 8. Split time-series (80% awal = train)
split_index = int(len(X) * 0.8)
X_train, X_test = X.iloc[:split_index], X.iloc[split_index:]
y_train, y_test = y.iloc[:split_index], y.iloc[split_index:]

# 9. Train pipeline
pipeline.fit(X_train, y_train)

# 10. Evaluasi model
y_pred = pipeline.predict(X_test)
print("\n=== Evaluasi Model Time-Series (Pipeline) ===")
print(f"MAE : {mean_absolute_error(y_test, y_pred):,.2f}")
print(f"MSE : {mean_squared_error(y_test, y_pred):,.2f}")
print(f"R²  : {r2_score(y_test, y_pred):.4f}")

# 11. Simpan model pipeline
os.makedirs("models", exist_ok=True)
with open("models/timeseries_pipeline_model.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("\n✅ Model pipeline berhasil disimpan di: models/timeseries_pipeline_model.pkl")
