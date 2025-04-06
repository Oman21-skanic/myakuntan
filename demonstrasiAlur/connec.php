<?php
$host = "localhost";
$user = "root"; // Sesuaikan dengan user MySQL Anda
$pass = ""; // Kosongkan jika tidak ada password
$db = "neraca_saldo";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

if (!defined('BASE_URL')) {
    define('BASE_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/Dicoding%20try/repo%20demonstrasi%20%20ML%20my%20akuntan/Demonstrasi-Alur-Keuangan-UMKM-Myakuntan-Machinne-Learning-/');
}