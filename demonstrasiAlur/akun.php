<?php
require 'connec.php';
include 'navbar.php';

if (isset($_POST['submit'])) {
    $nama_akun = $_POST['nama_akun'];
    $kategori = $_POST['kategori'];

    // Hindari nama tabel yang tidak valid dengan mengganti spasi dengan underscore
    $nama_tabel = preg_replace('/\s+/', '_', strtolower($nama_akun));

    // Tambahkan akun ke database
    $insertAkun = mysqli_query($conn, "INSERT INTO akun (nama_akun, kategori) VALUES ('$nama_akun', '$kategori')");

    if ($insertAkun) {
        // Buat tabel baru dengan nama akun
        $queryTabel = "CREATE TABLE `$nama_tabel` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tanggal DATE NOT NULL,
            nama_transaksi VARCHAR(255) NOT NULL,
            debit DECIMAL(15,2) DEFAULT 0,
            kredit DECIMAL(15,2) DEFAULT 0,
            saldo DECIMAL(15,2) DEFAULT 0
        )";

        mysqli_query($conn, $queryTabel);
    }

    header("Location: akun.php");
}

if (isset($_GET['delete'])) {
    $id = $_GET['delete'];

    // Ambil nama akun sebelum dihapus
    $result = mysqli_query($conn, "SELECT nama_akun FROM akun WHERE id_akun = $id");
    $row = mysqli_fetch_assoc($result);
    $nama_tabel = preg_replace('/\s+/', '_', strtolower($row['nama_akun']));

    // Hapus tabel terkait
    mysqli_query($conn, "DROP TABLE IF EXISTS `$nama_tabel`");

    // Hapus akun dari tabel akun
    mysqli_query($conn, "DELETE FROM akun WHERE id_akun = $id");

    header("Location: akun.php");
}

$akun = mysqli_query($conn, "SELECT * FROM akun");
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelola Akun</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-5">
        <h2 class="mb-4">Daftar kategori</h2>
        <table class="table table-bordered">
            <thead class="thead-light">
                <tr>
                    <th>ID Akun</th>
                    <th>Kategori</th>
                    <th>Nama Akun</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = mysqli_fetch_assoc($akun)): ?>
                    <tr>
                        <td><?= $row['id_akun'] ?></td>
                        <td><?= $row['kategori'] ?></td>
                        <td><?= $row['nama_akun'] ?></td>
                        <td>
                            <a href="akun.php?delete=<?= $row['id_akun'] ?>" class="btn btn-danger btn-sm">Hapus</a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

        <h3 class="mt-5">Tambah Kategori</h3>
        <form method="POST" class="form-inline">
            <div class="form-group mb-2">
                <input type="text" name="nama_akun" class="form-control" placeholder="Nama kategori" required>
            </div>
            <div class="form-group mx-sm-3 mb-2">
                <select name="kategori" class="form-control">
                    <?php
                    $query = "SELECT DISTINCT kategori FROM akun ORDER BY kategori ASC";
                    $result = $conn->query($query);

                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            echo '<option value="' . htmlspecialchars($row['kategori']) . '">' . htmlspecialchars($row['kategori']) . '</option>';
                        }
                    } else {
                        echo '<option value="">Belum ada kategori</option>';
                    }
                    ?>
                </select>
            </div>
            <button type="submit" name="submit" class="btn btn-primary mb-2">Tambah</button>
        </form>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>