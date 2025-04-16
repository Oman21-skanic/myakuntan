
# 💼 MyAkuntan

**MyAkuntan** adalah aplikasi berbasis web yang dibangun dengan arsitektur *client-server*. Aplikasi ini ditujukan untuk kebutuhan pencatatan transaksi atau keuangan sederhana. Terdiri dari dua bagian utama yaitu frontend (`client`) dan backend (`server`).

---

## 📁 Struktur Proyek

```
myakuntan/
├── client    # Frontend menggunakan Vite
└── server    # Backend menggunakan Express.js
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/Oman21-skanic/myakuntan.git
cd myakuntan
```

---

### 2. Install Dependency

Masuk ke masing-masing folder (`client` dan `server`), lalu jalankan:

```bash
npm install
```

Lakukan ini di **kedua folder** (`client` dan `server`).

---

### 3. Menjalankan Aplikasi

#### ▶️ Jalankan Frontend (Vite)

```bash
cd client
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

---

#### ▶️ Jalankan Backend (Development Mode)

```bash
cd server
npm run start-dev
```

Backend akan berjalan sesuai port yang telah diatur (biasanya `http://localhost:3000`).

---

## ⚙️ Persyaratan

Sebelum menjalankan aplikasi, pastikan kamu sudah menginstal:

- [Node.js](https://nodejs.org/) (versi LTS sangat disarankan)
- npm (biasanya sudah termasuk saat menginstall Node.js)

---

## 📌 Catatan

- Pastikan file konfigurasi backend (misalnya `.env`) sudah disiapkan dengan benar jika diperlukan.
- Jalankan `client` dan `server` di terminal yang berbeda agar keduanya bisa berjalan secara paralel.

---

## 📬 Kontribusi & Kontak

Silakan buat [Issue](https://github.com/Oman21-skanic/myakuntan/issues) jika menemukan bug atau punya saran pengembangan.  
Atau hubungi langsung melalui GitHub [@Oman21-skanic](https://github.com/Oman21-skanic).

---

## 📝 Lisensi

Proyek ini berada di bawah lisensi **MIT** – silakan lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

Selamat menggunakan dan semoga bermanfaat! 🎉

