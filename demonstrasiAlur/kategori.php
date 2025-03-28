<?php
require 'connec.php';
include 'navbar.php';

// CREATE: Tambah Kategori
if (isset($_POST['submit'])) {
    $nama_kategori = $_POST['nama_kategori'];
    $query = "INSERT INTO akun (kategori) VALUES ('$nama_kategori')";
    if ($conn->query($query)) {
        header("Location: kategori.php");
        exit();
    } else {
        echo "Error: " . $conn->error;
    }
}

// DELETE: Hapus Kategori
if (isset($_GET['delete'])) {
    $id_kategori = $_GET['delete'];
    $query = "DELETE FROM akun WHERE kategori = (SELECT kategori FROM akun WHERE id_akun = $id_kategori LIMIT 1)";
    if ($conn->query($query)) {
        header("Location: kategori.php");
        exit();
    } else {
        echo "Error: " . $conn->error;
    }
}

// READ: Ambil daftar kategori unik
$queryKategori = "SELECT DISTINCT kategori, MIN(id_akun) as id_kategori FROM akun GROUP BY kategori ORDER BY kategori ASC";
$kategoriResult = $conn->query($queryKategori);
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
        <h2>Manajemen Akun</h2>

        <h4 class="mt-4">Tambah Akun</h4>
        <form method="POST" class="form-inline">
            <input type="text" name="nama_kategori" class="form-control mr-2" placeholder="Nama Akun" required>
            <button type="submit" name="submit" class="btn btn-primary">Tambah</button>
        </form>

        <h4 class="mt-5">Daftar Akun</h4>
        <table class="table table-bordered">
            <thead class="thead-light">
                <tr>
                    <th>Nama akun</th>
                    <th>Jumlah kategori</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = $kategoriResult->fetch_assoc()): ?>
                    <?php
                    $kategori = $row['kategori'];
                    $queryAkun = "SELECT COUNT(*) as jumlah FROM akun WHERE kategori = '$kategori'";
                    $akunResult = $conn->query($queryAkun);
                    $jumlahAkun = ($akunResult->num_rows > 0) ? $akunResult->fetch_assoc()['jumlah'] : 0;
                    ?>
                    <tr>
                        <td><?= htmlspecialchars($kategori) ?></td>
                        <td><?= $jumlahAkun ?></td>
                        <td>
                            <a href="kategori.php?delete=<?= $row['id_kategori'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Yakin ingin menghapus kategori ini?');">Hapus</a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>