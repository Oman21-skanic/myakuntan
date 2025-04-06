<?php
require '../connec.php';
include '../navbar.php';

// Ambil persentase pajak dari database
$query_pajak = $conn->query("SELECT pajak_persen FROM pengaturan LIMIT 1");
$data_pajak = $query_pajak->fetch_assoc();
$pajak_persen = $data_pajak ? $data_pajak['pajak_persen'] : 10;

// Ambil saldo terakhir dari masing-masing akun
function getSaldoTerakhir($conn, $tabel)
{
    $query = $conn->query("SELECT saldo FROM $tabel ORDER BY id DESC LIMIT 1");
    $data = $query->fetch_assoc();
    return $data ? $data['saldo'] : 0;
}

$total_pendapatan = getSaldoTerakhir($conn, 'buku_pendapatan');
$total_hpp = getSaldoTerakhir($conn, 'buku_persediaan'); // Harga Pokok Penjualan
$total_beban = getSaldoTerakhir($conn, 'buku_beban');

// Hitung pajak
$total_pajak = ($total_pendapatan * $pajak_persen) / 100;

// Perhitungan Laba Rugi
$laba_kotor = $total_pendapatan - $total_hpp;
$laba_operasional = $laba_kotor - $total_beban;
$laba_bersih_sebelum_pajak = $laba_operasional;
$laba_bersih_setelah_pajak = $laba_bersih_sebelum_pajak - $total_pajak;
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Laba Rugi</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script>
        function printPage() {
            window.print();
        }
    </script>
</head>

<body>
    <div class="container mt-4">
        <button class="btn btn-primary mb-3" onclick="printPage()">Print laporan</button>
        <h2 class="text-center">Laporan Laba Rugi</h2>
        <table class="table table-bordered">
            <thead class="table-light">
                <tr>
                    <th>Keterangan</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Pendapatan</strong></td>
                    <td>Rp. <?= number_format($total_pendapatan, 2, ',', '.') ?></td>
                </tr>
                <tr>
                    <td>Harga Pokok Penjualan (HPP)</td>
                    <td>(Rp. <?= number_format($total_hpp, 2, ',', '.') ?>)</td>
                </tr>
                <tr class="table-warning">
                    <td><strong>Laba Kotor</strong></td>
                    <td><strong>Rp. <?= number_format($laba_kotor, 2, ',', '.') ?></strong></td>
                </tr>
                <tr>
                    <td>Beban Operasional</td>
                    <td>(Rp. <?= number_format($total_beban, 2, ',', '.') ?>)</td>
                </tr>
                <tr class="table-info">
                    <td><strong>Laba Operasional</strong></td>
                    <td><strong>Rp. <?= number_format($laba_operasional, 2, ',', '.') ?></strong></td>
                </tr>
                <tr>
                    <td>Pajak (<?= $pajak_persen ?>%)</td>
                    <td>(Rp. <?= number_format($total_pajak, 2, ',', '.') ?>)</td>
                </tr>
                <tr class="table-success">
                    <td><strong>Laba Bersih Setelah Pajak</strong></td>
                    <td><strong>Rp. <?= number_format($laba_bersih_setelah_pajak, 2, ',', '.') ?></strong></td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>