<?php
require 'connec.php';
include 'navbar.php';

if (isset($_POST['submit'])) {
    $tanggal = $_POST['tanggal'];
    $nama_transaksi = $_POST['nama_transaksi'];
    $debit = $_POST['debit'];
    $kredit = $_POST['kredit'];
    $id_akun = $_POST['id_akun'];

    mysqli_query($conn, "INSERT INTO transaksi (tanggal, nama_transaksi, debit, kredit, id_akun) 
                            VALUES ('$tanggal', '$nama_transaksi', '$debit', '$kredit', '$id_akun')");
    header("Location: transaksi.php");
}

if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    mysqli_query($conn, "DELETE FROM transaksi WHERE id_transaksi = $id");
    header("Location: transaksi.php");
}

$transaksi = mysqli_query($conn, "SELECT t.*, a.nama_akun FROM transaksi t JOIN akun a ON t.id_akun = a.id_akun ORDER BY t.tanggal DESC");
$akun = mysqli_query($conn, "SELECT * FROM akun");
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <title>Kelola Transaksi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .navbar-brand {
            margin-left: 20px;
        }
    </style>
</head>

<body>
    <div class="container mt-5">
        <h2 class="mb-3">Daftar Transaksi</h2>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tanggal</th>
                    <th>Nama Transaksi</th>
                    <th>Debit</th>
                    <th>Kredit</th>
                    <th>Akun</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = mysqli_fetch_assoc($transaksi)): ?>
                    <tr>
                        <td><?= $row['id_transaksi'] ?></td>
                        <td><?= $row['tanggal'] ?></td>
                        <td><?= $row['nama_transaksi'] ?></td>
                        <td>Rp<?= number_format($row['debit'], 0, ',', '.') ?></td>
                        <td>Rp<?= number_format($row['kredit'], 0, ',', '.') ?></td>
                        <td><?= $row['nama_akun'] ?></td>
                        <td><a href="transaksi.php?delete=<?= $row['id_transaksi'] ?>" class="btn btn-danger btn-sm">Hapus</a>
                            <a href="detailTransaksi.php?id_akun=<?= $row['id_akun'] ?>" class="btn btn-info btn-sm">lihat Transaksi</a>
                        </td>

                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

        <h3 class="mt-4">Tambah Transaksi</h3>
        <form method="POST" class="mt-3">
            <div class="mb-2">
                <label class="form-label">Tanggal</label>
                <input type="date" name="tanggal" class="form-control" required>
            </div>
            <div class="mb-2">
                <label class="form-label">Nama Transaksi</label>
                <input type="text" name="nama_transaksi" class="form-control" placeholder="Nama Transaksi" required>
            </div>
            <div class="mb-2">
                <label class="form-label">Debit</label>
                <input type="number" name="debit" class="form-control" placeholder="Debit" value="0">
            </div>
            <div class="mb-2">
                <label class="form-label">Kredit</label>
                <input type="number" name="kredit" class="form-control" placeholder="Kredit" value="0">
            </div>
            <div class="mb-2">
                <label class="form-label">Akun</label>
                <select name="id_akun" class="form-select">
                    <option value="">Pilih Akun</option>
                    <?php while ($row = mysqli_fetch_assoc($akun)): ?>
                        <option value="<?= $row['id_akun'] ?>"><?= $row['nama_akun'] ?></option>
                    <?php endwhile; ?>
                </select>
            </div>
            <button type="submit" name="submit" class="btn btn-primary">Tambah</button>
        </form>
    </div>
</body>

</html>