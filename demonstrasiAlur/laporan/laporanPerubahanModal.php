<?php
include '../connec.php';
include '../navbar.php';
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Perubahan Modal</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script>
        function printPage() {
            window.print();
        }
    </script>
</head>
<body>
    <div class="container mt-5">
        <h2 class="mb-4">Laporan Perubahan Modal</h2>
        <button><button class="btn btn-primary mb-3" onclick="printPage()">Print laporan</button>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Nama Transaksi</th>
                    <th>Debit</th>
                    <th>Kredit</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $query = "SELECT * FROM buku_modal ORDER BY tanggal ASC";
                $result = $conn->query($query);
                while ($row = $result->fetch_assoc()) {
                    echo "<tr>
                            <td>{$row['tanggal']}</td>
                            <td>{$row['nama_transaksi']}</td>
                            <td>{$row['debit']}</td>
                            <td>{$row['kredit']}</td>
                            <td>{$row['saldo']}</td>
                          </tr>";
                }
                ?>
            </tbody>
        </table>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>