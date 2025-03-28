<?php
require 'connec.php';
include 'navbar.php';

// // Ambil data pajak yang ada
// $query = $conn->query("SELECT pajak_persen FROM pengaturan LIMIT 1");
// $data = $query->fetch_assoc();
// $pajak_persen = $data ? $data['pajak_persen'] : 10;

// // Update pajak jika form dikirim
// if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//     $pajak_baru = $_POST['pajak_persen'];
//     $conn->query("UPDATE pengaturan SET pajak_persen = $pajak_baru WHERE id = 1");
//     echo "<script>alert('Pajak berhasil diperbarui!'); window.location.href='index.php';</script>";
// }
// ?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Keuangan</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
        }

        h2 {
            color: #343a40;
        }

        .btn {
            margin-right: 10px;
        }

        .table th,
        .table td {
            vertical-align: middle;
        }

        .card {
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="container mt-5">
        <h2 class="mb-4">📊 Dashboard Keuangan</h2>

        <nav class="mb-4">
            <a href="akun.php" class="btn btn-primary">➕ Kelola Akun</a>
            <a href="transaksi.php" class="btn btn-success">📋 Kelola Transaksi</a>
            <a href="neraca.saldo.php" class="btn btn-info">📑 Lihat Neraca Saldo</a>
            <a href="laporan.php" class="btn btn-warning">📈 Laporan Laba Rugi</a>
            <a href="prediksi.php" class="btn btn-secondary">🔮 Prediksi Rugi</a>
            <a href="pajak.php" class="btn btn-danger">🚨 Pajak</a>
        </nav>

        <div class="card">
            <div class="card-body">
                <h5 class="card-title">📌 Daftar Akun</h5>
                <table class="table table-bordered">
                    <thead class="thead-light">
                        <tr>
                            <th>ID Akun</th>
                            <th>Kategori</th>
                            <th>Nama Akun</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $akun = mysqli_query($conn, "SELECT * FROM akun");
                        while ($row = mysqli_fetch_assoc($akun)) {
                            echo "<tr>
                                    <td>{$row['id_akun']}</td>
                                    <td>{$row['kategori']}</td>
                                    <td>{$row['nama_akun']}</td>
                                </tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h5 class="card-title">📌 Transaksi Terbaru</h5>
                <table class="table table-bordered">
                    <thead class="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>Tanggal</th>
                            <th>Nama Transaksi</th>
                            <th>Debit</th>
                            <th>Kredit</th>
                            <th>Akun</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $transaksi = mysqli_query($conn, "SELECT t.*, a.nama_akun 
                                                          FROM transaksi t 
                                                          JOIN akun a ON t.id_akun = a.id_akun 
                                                          ORDER BY t.tanggal DESC LIMIT 5");
                        while ($row = mysqli_fetch_assoc($transaksi)) {
                            echo "<tr>
                                    <td>{$row['id_transaksi']}</td>
                                    <td>{$row['tanggal']}</td>
                                    <td>{$row['nama_transaksi']}</td>
                                    <td>Rp" . number_format($row['debit'], 0, ',', '.') . "</td>
                                    <td>Rp" . number_format($row['kredit'], 0, ',', '.') . "</td>
                                    <td>{$row['nama_akun']}</td>
                                </tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

<!-- 
    <section id="pajak" class="container mt-4">
        <h2 class="text-center">Pengaturan Pajak</h2>
        <form method="POST">
            <div class="mb-3">
                <label for="pajak_persen" class="form-label">Persentase Pajak (%)</label>
                <input type="number" name="pajak_persen" id="pajak_persen" class="form-control" value="<?= $pajak_persen ?>" required>
            </div>
            <button type="submit" class="btn btn-primary">Simpan</button>
        </form>
    </section> -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/js/bootstrap.min.js"></script>
</body>

</html>