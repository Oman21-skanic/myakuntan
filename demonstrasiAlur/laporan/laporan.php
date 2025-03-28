<?php
include '../connec.php';
include '../navbar.php';
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Laporan</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-5">
        <h2 class="mb-4">Laporan Keuangan</h2>
        <div class="list-group">
            <a href="laporanLabaRugi.php" class="list-group-item list-group-item-action">Laporan Laba Rugi</a>
            <a href="laporanArusKas.php" class="list-group-item list-group-item-action">Laporan Arus Kas</a>
            <a href="laporanPerubahanModal.php" class="list-group-item list-group-item-action">Laporan Perubahan Modal</a>
            <a href="<?=BASE_URL ?>neraca.saldo.php" class="list-group-item list-group-item-action">Laporan Neraca</a>
            <a href="<?=BASE_URL ?>laporanPajak.php" class="list-group-item list-group-item-action">Laporan Pajak</a>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>