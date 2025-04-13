# 📡 API BASE URL

Semua endpoint diawali dengan:
```
http://localhost:3000/api
```

---

# 🔐 AUTENTIKASI API

## 1. LOGIN DENGAN GOOGLE

**Deskripsi:**

User akan mengklik tombol login dengan Google dan diarahkan ke halaman autentikasi Google.  
Setelah user memilih akun, akan diarahkan ke halaman frontend untuk meng-handle callback.

**Contoh tombol di frontend:**
```html
<button onclick="window.location.href = googleAuthUrl">Login with Google</button>
```

**Contoh URL Google Auth (dalam satu baris):**
```js
const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=805561252134-mgf46ljpbtpq115n08oeodpfobms76a6.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=profile%20email';
```

**Atau bisa dipisah:**
```js
const clientId = '805561252134-mgf46ljpbtpq115n08oeodpfobms76a6.apps.googleusercontent.com';
const redirectUri = 'http://localhost:3000/auth/google/callback';
const responseType = "code";
const scope = "profile email";
const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
```

Frontend akan meng-handle kode dari URL dan mengirim ke backend.

**Endpoint:** `/v1/auth/google`  
**Method:** `POST`

**Body:**
```json
{
  "code": "authorization_code_dari_google"
}
```

**Contoh request di frontend:**
```js
async function handleGoogleLogin() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const error = params.get("error");

  if (error === "access_denied") {
    showError("Anda membatalkan proses login dengan Google.");
    return;
  }
  if (error) {
    showError("Terjadi kesalahan saat login dengan Google.");
    return;
  }

  if (!code) {
    showError("Kode otorisasi tidak ditemukan.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await response.json();
    if (data.status !== 'success') {
      showError(data.message || "Login gagal.");
      return;
    }
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  } catch (err) {
    console.error("Error:", err);
    showError("Terjadi kesalahan pada koneksi.");
  }
}
```

**Response jika berhasil:**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": { user }
}
```

**Response jika gagal:**
```json
{
  "status": "fail",
  "message": "Kode otorisasi tidak valid"
}
```

---

## 2. LOGIN

**Method:** `POST`  
**API:** `/v1/auth/sessions`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Contoh:**
```js
const response = await fetch(
  "http://localhost:3000/api/auth/sessions",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }
);
```

**Response jika berhasil:**
```json
{ "status": "success", "message": "Berhasil login" }
```

**Response jika gagal:**
```json
{ "status": "fail", "message": "Password salah" }
```

---

## 3. LOGOUT

**Method:** `DELETE`  
**API:** `/v1/auth/sessions`  
**Credentials:** `'include'`

**Contoh:**
```js
try {
  const response = await fetch("/api/v1/auth/sessions", { method: "DELETE" });
  if (response.ok) {
    window.location.href = "/login";
  } else {
    alert("Gagal logout");
  }
} catch (error) {
  console.error(error);
}
```

**Response jika berhasil:**
```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

**Response jika gagal:**
```json
{
  "status": "fail",
  "message": "Terjadi kesalahan saat logout",
  "data": "error.message"
}
```

## OTP API

OTP digunakan untuk verifikasi email saat registrasi akun baru.

### 1. Resend OTP

**Method:** `POST`  
**API:** `/v1/auth/otp`  
**Credentials:** `'include'`

Server akan mengambil data email dari temptoken, memperbarui OTP, dan mengirim ulang kode ke email user.

**Response berhasil:**
```json
{
  "status": "success",
  "message": "Kode OTP telah dikirim",
  "data": "email"
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "invalid or error token",
  "data": "error.message"
}
```

---

### 2. Verifikasi OTP

**Method:** `POST`  
**API:** `/v1/auth/otp/verify`  
**Credentials:** `'include'`

**Body:**
```json
{
  "otp": "123456"
}
```

**Response berhasil:**
```json
{
  "status": "success",
  "message": "Verifikasi berhasil, akun telah dibuat"
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "OTP salah atau sudah kadaluarsa."
}
```
---

# 👤 USERS API

## 1. REGISTRASI USER

**Method:** `POST`  
**API:** `/v1/users`

**Body:**
```json
{
  "name": "Nama User",
  "email": "user@example.com",
  "password": "password"
}
```

**Response berhasil:**
```json
{
  "status": "success",
  "message": "Kode OTP telah dikirim",
  "data": "user9207@gmail.com"
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "Gagal mengirim OTP",
  "data": "error.message"
}
```

---

## 2. AMBIL DATA ALL USER (ADMIN ONLY)

**Method:** `GET`  
**API:** `/v1/users`  
**Credentials:** `'include'`

**Response berhasil:**
```json
{
    status: 'success',
    messsage: 'all user',
    results: users.length,
    data: users,
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "You do not have permission"
}
```

---

## 3. AMBIL DATA USER LOGIN

**Method:** `GET`  
**API:** `/v1/users/me`  
**Credentials:** `'include'`

**Response berhasil:**
```json
{
  "status": "success",
  "data": {
    "_id": "67e8ed3e6adb75a36de26bbe",
    "name": "Febrian-tekno-99",
    "email": "putraf9207@gmail.com"
  }
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "user not found"
}
```

---

## 4. AMBIL DETAIL DATA USER

**Method:** `GET`  
**API:** `/v1/users/:id`  
**Credentials:** `'include'`

**Response berhasil:**
```json
{
  "status": "success",
  "message": "data user berhasil diambil",
  "data": {
    "_id": "67e8ed3e6adb75a36de26bbe",
    "name": "Febrian-tekno-99",
    "email": "putraf9207@gmail.com",
    "role": "user",
    "isVerified": true,
    "is_oauth": false,
    "createdAt": "2025-03-30T07:05:34.979Z",
    "updatedAt": "2025-03-30T07:06:15.537Z",
    "__v": 0,
    "ledgerId": "67ee5a016e7a4d92a6b37ac8",
    "ledgerName": "usaha Lele pak adi"
  }
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "User tidak ditemukan"
}
```

---

## 5. UPDATE DATA USER (bidangUsaha, name, email, password)

**Method:** `PUT`  
**API:** `/v1/users/:id`  
**Credentials:** `'include'`
- **Deskripsi**: note: jika mengganti bidang usaha maka semua akun dan transaksi yang lama akan hilang.



**Body:**
```json
{
  "bidangUsaha": "Jasa", // atau "Manufaktur" / "Perdagangan"
  "name": "Nama Baru",
  "email": "emaibaru@gmail.com",
  "password" : "password",
}
```

**Response berhasil:**
```json
{
  "status": "success",
  "message": "Profil berhasil diperbarui",
  "data": "updatedUser"
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "User tidak ditemukan"
}
```

---

## 6. UPDATE PASSWORD

**Method:** `PUT`  
**API:** `/v1/users/:id/password`  
**Credentials:** `'include'`

**Body:**
```json
{
  "oldPassword": "passwordLama",
  "newPassword": "passwordBaru"
}
```

**Response berhasil:**
```json
{
  "status": "success",
  "message": "Password berhasil diperbarui"
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "Password lama salah"
}
```

---

## 7. DELETE USER

**Method:** `DELETE`  
**API:** `/v1/users/:id`  
**Credentials:** `'include'`
**Description:** `ketika user dihapus maka semua entitas data yang berhubungan dengan user tersebut juga akan dihapus`

**Response berhasil:**
```json
{
  "status": "success",
  "message": "user febrian-tekno99 berhasil dihapus"
}
```

**Response gagal:**
```json
{
  "status": "fail",
  "message": "User tidak ditemukan"
}
```

# 🔐 API Reset Password

## 1. Kirim OTP Reset Password

**Endpoint**: `POST /v1/password-reset`  
**Deskripsi**: Mengirim OTP ke email user untuk proses reset password.

### Request Body
```json
{
  "email": "user@email.com"
}
```

### ✅ Response Berhasil
**Status Code**: `200 OK`
```json
{
  "status": "success",
  "message": "Kode OTP telah dikirim ke email",
  "data": "user@email.com"
}
```

### ❌ Response Gagal
**Status Code**: `404 Not Found`
```json
{
  "status": "fail",
  "message": "User tidak ditemukan atau belum diverifikasi"
}
```

---

## 2. Verifikasi OTP Reset Password

**Endpoint**: `POST /v1/password-reset/verify`  
**Credentials**: `include`  
**Deskripsi**: Memverifikasi OTP yang dikirim ke email.

### Request Body
```json
{
  "otp": "123456"
}
```

### ✅ Response Berhasil
**Status Code**: `200 OK`
```json
{
  "status": "success",
  "message": "OTP valid. Silakan atur password baru."
}
```

### ❌ Response Gagal
**Status Code**: `400 Bad Request`
```json
{
  "status": "fail",
  "message": "OTP salah atau sudah kadaluarsa."
}
```

---

## 3. Update Password Baru

**Endpoint**: `PUT /v1/password-reset`  
**Credentials**: `include`  
**Deskripsi**: Mengatur password baru setelah OTP berhasil diverifikasi.

### Request Body
```json
{
  "password": "passwordBaru123"
}
```

### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "Password berhasil diperbarui."
}
```

### ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "OTP belum diverifikasi atau request tidak valid."
}
```

## 🧑‍💼 USER ACCOUNTS API

### 1. Buat Akun Baru untuk User

**Method**: `POST`  
**Endpoint**: `/v1/users/:id/accounts`  
**Credentials**: `include`  
**Deskripsi**: Membuat akun baru untuk user tertentu berdasarkan ID user.

#### 🔸 Body
```json
{
  "bidangUsaha": "Jasa" // atau "Manufaktur" / "Perdagangan"
}
```

#### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "Accounts berhasil dibuat!"
}
```

#### ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "User sudah memiliki accounts"
}
```

---

# 🧾 API Accounts

## 1. Ambil Detail Akun

**Method**: `GET`  
**Endpoint**: `/v1/accounts/:accountId`  
**Credentials**: `include`  
**Deskripsi**: Mengambil data detail akun berdasarkan ID akun.

### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "Berhasil mendapat data account",
  "data": { ... }
}
```

### ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "Account not found"
}
```

---

### 2. Ambil Semua Akun Milik User

**Method**: `GET`  
**Endpoint**: `/v1/accounts?userId=USER_ID`  
**Credentials**: `include`  
**Deskripsi**: Mengambil semua akun milik user berdasarkan query `userId`.

#### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "Berhasil mengambil semua akun milik user",
  "data": accounts
}
```

#### ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "Forbidden, access denied for this user"
}
```

---


# 💸 API Transaksi

## 1. Buat Transaksi Baru
- **Method**: `POST`  
- **Endpoint**: `/v1/transactions`  
- **Credentials**: include  
- **Deskripsi**: Membuat transaksi baru untuk akun milik user.

### 📥 Request Body
```json
{
  "tanggal": "2025-04-11T10:30:00.000Z",
  "keterangan": "Pembelian alat tulis",
  "nominal": 50000,
  "akun_debit_id": "6617f7c1207d5bfc2ad439e1",
  "akun_credit_id": "6617f7c1207d5bfc2ad439e1"
  
}
```

> tanggal harus berformat iso. akun debit dan akun kredit wajib di isi dengan id dari akun yang bersangkutan. untuk mendapat id akun dapat mengunakan get all account user (api account no 2).

### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "Transaksi berhasil dibuat & akun diupdate",
  "data": {
    "_id": "6617fa48207d5bfc2ad439f3",
    "user_id": "6617f7b0207d5bfc2ad439de",
    "tanggal": "2025-04-11T10:30:00.000Z",
    "keterangan": "Pembelian alat tulis",
    "nominal": 50000,
    "akun_debit_id": "6617f7c1207d5bfc2ad439e1",
    "akun_credit_id": "6617f7c1207d5bfc2ad439e1",
    "createdAt": "2025-04-11T12:00:00.000Z",
    "updatedAt": "2025-04-11T12:00:00.000Z"
  }
}
```
## ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "message"
}
```

---

## 2. Ambil Transaksi Spesifik

**Method**: `GET`  
**Endpoint**: `/v1/transactions/:transactionId`  
**Credentials**: `include`  
**Deskripsi**: Mengambil detail satu transaksi berdasarkan ID.

### ✅ Response Berhasil {json sedang diperbaiki}
```json
{
  status: 'success', message: 'berhasil mendapat data transaksi', data: transaction
}
```

### ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "Transaksi tidak ditemukan"
}
```

---

### 3. Ambil Semua Transaksi Milik User

**Method**: `GET`  
**Endpoint**: `/v1/transactions?userId=USER_ID`  
**Credentials**: `include`  
**Deskripsi**: Mengambil semua transaksi berdasarkan ID user (dari query `userId`).

#### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "berhasil mendapat transaksi",
  "results": transactions.length,
  "data": transactions
}
```

#### ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "Access denied: not your transactions"
}
```

---

### 4. Ambil Semua Transaksi Berdasarkan Account

**Method**: `GET`  
**Endpoint**: `/v1/transactions?accountId=ACCOUNT_ID`  
**Credentials**: `include`  
**Deskripsi**: Mengambil semua transaksi berdasarkan `accountId`.

#### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "berhasil mendapat transaksi",
  "results": transactions.length,
  "data": transactions
}
```

#### ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "Access denied: not your transactions"
}
```

---

### 5. Ambil Semua Transaksi (Admin Only)

**Method**: `GET`  
**Endpoint**: `/v1/transactions`  
**Credentials**: `include`  
**Deskripsi**: Mengambil semua transaksi di database. Hanya bisa diakses oleh admin.

#### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "berhasil mendapat transaksi",
  "results": transactions.length,
  "data": transactions
}
```

#### ❌ Response Gagal
```json
{
  "status": "fail",
  "message": "Only admin can access all transactions"
}
```

---
---

## 6. Update Transaksi
- **Method**: `PUT`  
- **Endpoint**: `/v1/transactions/:transactionId`  
- **Credentials**: include  
- **Deskripsi**: Memperbarui transaksi milik user. Hanya `tanggal`, `keterangan`, dan `nominal` yang dapat diperbarui.

### 📥 Request Body
```json
{
  "tanggal": "2025-04-11T10:30:00.000Z",
  "keterangan": "Penambahan modal awal",
  "nominal": 50000,
}

```

### ✅ Response Berhasil
```json
{
    "status": "success",
    "message": "Transaksi berhasil diperbarui & akun diperbarui",
    "data": {
        "user_id": "67f973fa4505491174b4aaa9",
        "tanggal": "2025-04-11T10:30:00.000Z",
        "keterangan": "Penambahan modal awal",
        "nominal": 50000,
        "akun_debit_id": "67f97685f1dc4eb3c89c78f8",
        "akun_credit_id": "67f97685f1dc4eb3c89c78f9",
        "_id": "67f977922bebf786fdd962ab",
        "__v": 0
    }
}
```

### ❌ Response Gagal (Update)
```json
{
  "status": "fail",
  "message": "Transaksi tidak ditemukan atau bukan milik user"
}
```

---

## 7. Hapus Transaksi
- **Method**: `DELETE`  
- **Endpoint**: `/v1/transactions/:transactionId`  
- **Credentials**: include  
- **Deskripsi**: Menghapus transaksi milik user.

### ✅ Response Berhasil
```json
{
  "status": "success",
  "message": "Transaksi berhasil dihapus dan akun diperbarui"
}
```

### ❌ Response Gagal (Delete)
```json
{
  "status": "fail",
  "message": "Transaksi tidak ditemukan atau bukan milik user"
}
```
