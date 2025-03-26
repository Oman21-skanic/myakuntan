<?php
require './connec.php';
include './navbar.php';

// Proses update pajak
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $pajak_baru = $_POST['pajak_persen'];

    // Validasi input untuk memastikan bahwa pajak adalah angka
    if (is_numeric($pajak_baru) && $pajak_baru >= 0) {
        $stmt = $conn->prepare("UPDATE pengaturan SET pajak_persen = ? WHERE id = 1");
        if ($stmt) {
            $stmt->bind_param("d", $pajak_baru); // "d" untuk double
            if ($stmt->execute()) {
                echo "<script>alert('Pajak berhasil diperbarui!'); window.location.href='pajak.php';</script>";
            } else {
                echo "<script>alert('Terjadi kesalahan saat memperbarui pajak!');</script>";
                echo "Error: " . $stmt->error;
            }
            $stmt->close();
        } else {
            echo "<script>alert('Gagal menyiapkan statement!');</script>";
            echo "Error: " . $conn->error;
        }
    } else {
        echo "<script>alert('Silakan masukkan nilai pajak yang valid.');</script>";
    }
}

// Ambil nilai pajak terbaru
$query_pajak = $conn->query("SELECT pajak_persen FROM pengaturan WHERE id = 1");
if ($query_pajak) {
    $data_pajak = $query_pajak->fetch_assoc();
    $pajak_persen = $data_pajak ? $data_pajak['pajak_persen'] : 10;
} else {
    echo "<script>alert('Gagal mengambil data pajak!');</script>";
    echo "Error: " . $conn->error;
    $pajak_persen = 10; 
}
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pengaturan Pajak</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="container mt-4">
        <h2>Pengaturan Pajak</h2>
        <form method="POST">
            <label for="pajak_persen" class="form-label">Persentase Pajak (%)</label>
            <input type="number" step="0.01" class="form-control" name="pajak_persen" value="<?= htmlspecialchars($pajak_persen) ?>" required>
            <button type="submit" class="btn btn-primary mt-3">Simpan</button>
        </form>
    </div>
</body>

</html>