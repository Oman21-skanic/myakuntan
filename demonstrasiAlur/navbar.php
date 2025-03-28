<?php
require 'connec.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="<?=BASE_URL?>index.php">MyAkuntan Cihuyy</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="<?=BASE_URL?>akun.php">Kategori</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?=BASE_URL?>kategori.php">Akun</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?=BASE_URL?>transaksi.php">Transaksi</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?=BASE_URL?>neraca.saldo.php">Neraca Saldo</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?=BASE_URL?>laporan/laporan.php">Laporan</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?=BASE_URL?>prediksi.php">Prediksi Rugi</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>

</body>

</html>