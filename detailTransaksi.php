<?php
require 'connec.php';
include 'navbar.php';

if (!isset($_GET['id_akun'])) {
    header("Location: transaksi.php");
    exit();
}

$id_akun = $_GET['id_akun'];


$akun = mysqli_query($conn, "SELECT nama_akun FROM akun WHERE id_akun = $id_akun");
if (!$akun || mysqli_num_rows($akun) == 0) {
    echo "Akun tidak ditemukan!";
    exit();
}
$nama_akun = mysqli_fetch_assoc($akun)['nama_akun'];

$transaksi = mysqli_query($conn, "SELECT * FROM transaksi WHERE id_akun = $id_akun ORDER BY tanggal ASC");

?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Transaksi - <?= htmlspecialchars($nama_akun) ?></title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
        }

        .container-content {
            padding: 20px;
        }
    </style>
</head>

<body>
    <div class="container-content">
        <h2>Detail Transaksi: <?= htmlspecialchars($nama_akun) ?></h2>
        <a href="transaksi.php" class="btn btn-secondary mb-3">Kembali</a>

        <table class="table table-bordered">
            <thead class="thead-light">
                <tr>
                    <th>No</th>
                    <th>ID Transaksi</th>
                    <th>Tanggal</th>
                    <th>Nama Transaksi</th>
                    <th>Debit</th>
                    <th>Kredit</th>
                    <th>Total Kumulatif</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $no = 1;
                $total_kumulatif = 0;
                while ($row = mysqli_fetch_assoc($transaksi)):
                    $total_kumulatif += $row['debit'] - $row['kredit']; 
                ?>
                    <tr>
                        <td><?= $no++ ?></td>
                        <td><?= htmlspecialchars($row['id_transaksi']) ?></td>
                        <td><?= htmlspecialchars($row['tanggal']) ?></td>
                        <td><?= htmlspecialchars($row['nama_transaksi']) ?></td>
                        <td>Rp<?= number_format($row['debit'], 0, ',', '.') ?></td>
                        <td>Rp<?= number_format($row['kredit'], 0, ',', '.') ?></td>
                        <td>Rp<?= number_format($total_kumulatif, 2, ',', '.') ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</body>

</html>