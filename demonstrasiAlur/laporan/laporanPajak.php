<?php
require '../connec.php';
include '../navbar.php';

// Ambil persentase pajak dari database
$query_pajak = $conn->query("SELECT pajak_persen FROM pengaturan LIMIT 1");
$data_pajak = $query_pajak->fetch_assoc();
$pajak_persen = $data_pajak ? $data_pajak['pajak_persen'] : 10;

// Ambil saldo terakhir dari buku_pendapatan
$query_pendapatan = $conn->query("SELECT saldo FROM buku_pendapatan ORDER BY id DESC LIMIT 1");
$data_pendapatan = $query_pendapatan->fetch_assoc();
$total_pendapatan = $data_pendapatan ? $data_pendapatan['saldo'] : 0;

// Hitung pajak
$total_pajak = ($total_pendapatan * $pajak_persen) / 100;
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Pajak</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="container mt-4">
        <h2 class="text-center">Laporan Pajak</h2>
        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Keterangan</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Total Pendapatan</td>
                    <td>Rp. <?= number_format($total_pendapatan, 2, ',', '.') ?></td>
                </tr>
                <tr>
                    <td>Pajak (<?= $pajak_persen ?>%)</td>
                    <td>Rp. <?= number_format($total_pajak, 2, ',', '.') ?></td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>