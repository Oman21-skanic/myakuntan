-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2025 at 03:09 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `neraca_saldo`
--

-- --------------------------------------------------------

--
-- Table structure for table `akun`
--

CREATE TABLE `akun` (
  `id_akun` int(11) NOT NULL,
  `nama_akun` varchar(255) NOT NULL,
  `kategori` enum('Kas','Modal','Pendapatan','Persediaan','Inventaris','Utang','Piutang','Beban') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `akun`
--

INSERT INTO `akun` (`id_akun`, `nama_akun`, `kategori`) VALUES
(2, 'buku modal', 'Modal'),
(3, 'buku kas', 'Kas'),
(4, 'buku pendapatan', 'Pendapatan'),
(5, 'buku persediaan', 'Persediaan'),
(6, 'buku inventaris', 'Inventaris'),
(7, 'buku utang', 'Kas'),
(9, 'buku piutang', 'Piutang');

-- --------------------------------------------------------

--
-- Table structure for table `buku_beban`
--

CREATE TABLE `buku_beban` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `saldo` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku_beban`
--

INSERT INTO `buku_beban` (`id`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `saldo`) VALUES
(1, '2023-10-15', 'Pembayaran Gaji', 0.00, 4000000.00, 4000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `buku_inventaris`
--

CREATE TABLE `buku_inventaris` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `saldo` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku_inventaris`
--

INSERT INTO `buku_inventaris` (`id`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `saldo`) VALUES
(1, '2023-10-01', 'Pembelian Aset Awal', 5000000.00, 0.00, 5000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `buku_kas`
--

CREATE TABLE `buku_kas` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `saldo` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku_kas`
--

INSERT INTO `buku_kas` (`id`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `saldo`) VALUES
(1, '2023-10-01', 'Setoran Awal', 10000000.00, 0.00, 10000000.00),
(2, '2023-10-03', 'Penjualan Barang', 5000000.00, 0.00, 15000000.00),
(3, '2023-10-05', 'Pembayaran Utang', 0.00, 2000000.00, 13000000.00),
(4, '2023-10-10', 'Pembelian Barang', 0.00, 3000000.00, 10000000.00),
(5, '2023-10-12', 'Penjualan Lain', 7000000.00, 0.00, 17000000.00),
(6, '2023-10-15', 'Pembayaran Gaji', 0.00, 4000000.00, 13000000.00),
(7, '2023-10-20', 'Setoran Tambahan', 2000000.00, 0.00, 15000000.00),
(8, '2023-10-25', 'Pembayaran Utang', 0.00, 3000000.00, 12000000.00),
(9, '2023-10-30', 'Penjualan Akhir Bulan', 8000000.00, 0.00, 20000000.00),
(10, '2023-10-31', 'Pendapatan', 5000000.00, 0.00, 25000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `buku_modal`
--

CREATE TABLE `buku_modal` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `saldo` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku_modal`
--

INSERT INTO `buku_modal` (`id`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `saldo`) VALUES
(1, '2023-10-01', 'Setoran Awal', 10000000.00, 0.00, 10000000.00),
(2, '2023-10-20', 'Setoran Tambahan', 2000000.00, 0.00, 12000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `buku_pendapatan`
--

CREATE TABLE `buku_pendapatan` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `saldo` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku_pendapatan`
--

INSERT INTO `buku_pendapatan` (`id`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `saldo`) VALUES
(1, '2023-10-03', 'Penjualan Barang', 5000000.00, 0.00, 5000000.00),
(2, '2023-10-12', 'Penjualan Lain', 7000000.00, 0.00, 12000000.00),
(3, '2023-10-30', 'Penjualan Akhir Bulan', 8000000.00, 0.00, 20000000.00),
(4, '2023-10-31', 'Pendapatan', 5000000.00, 0.00, 25000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `buku_persediaan`
--

CREATE TABLE `buku_persediaan` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `saldo` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku_persediaan`
--

INSERT INTO `buku_persediaan` (`id`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `saldo`) VALUES
(1, '2025-03-05', 'Pembelian Barang', 0.00, 3000000.00, 3000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `buku_piutang`
--

CREATE TABLE `buku_piutang` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `saldo` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku_piutang`
--

INSERT INTO `buku_piutang` (`id`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `saldo`) VALUES
(1, '2023-10-15', 'Penjualan Kredit ke Pelanggan A', 3000000.00, 0.00, 3000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `buku_utang`
--

CREATE TABLE `buku_utang` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `saldo` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku_utang`
--

INSERT INTO `buku_utang` (`id`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `saldo`) VALUES
(1, '2023-10-05', 'Pembayaran Utang', 0.00, 2000000.00, 2000000.00),
(2, '2023-10-25', 'Pembayaran Utang', 0.00, 3000000.00, 5000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `neraca_saldo`
--

CREATE TABLE `neraca_saldo` (
  `id_neraca` int(11) NOT NULL,
  `id_akun` int(11) DEFAULT NULL,
  `saldo_awal` decimal(15,2) DEFAULT 0.00,
  `total_debit` decimal(15,2) DEFAULT 0.00,
  `total_kredit` decimal(15,2) DEFAULT 0.00,
  `saldo_akhir` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan`
--

CREATE TABLE `pengaturan` (
  `id` int(11) NOT NULL,
  `pajak_persen` float NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengaturan`
--

INSERT INTO `pengaturan` (`id`, `pajak_persen`) VALUES
(1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `kredit` decimal(15,2) DEFAULT 0.00,
  `id_akun` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id_transaksi`, `tanggal`, `nama_transaksi`, `debit`, `kredit`, `id_akun`) VALUES
(5, '2025-03-01', 'setor modal awal', 10000000.00, 0.00, 3),
(6, '2025-03-01', 'setor modal awal', 0.00, 10000000.00, 2),
(7, '2025-03-02', 'pembelian barang dengan kredit', 5000000.00, 0.00, 5),
(8, '2025-03-02', 'pembelian barang dengan kredit', 0.00, 5000000.00, 7),
(9, '2025-03-02', 'pembelian kompor', 0.00, 500000.00, 3),
(10, '2025-03-02', 'pembelian kompor', 500000.00, 0.00, 6),
(11, '2025-03-05', 'pendapatan penjualan', 5500000.00, 0.00, 3),
(12, '2025-03-05', 'pendapatan penjualan', 0.00, 5500000.00, 4),
(14, '2025-03-06', 'pembelian barang tunai', 0.00, 2000000.00, 3),
(15, '2025-03-06', 'pembelian barang tunai', 2000000.00, 0.00, 5),
(16, '2025-03-06', 'pembelian barang dengan kredit', 0.00, 5000000.00, 5),
(17, '2025-03-07', 'setor modal', 5000000.00, 0.00, 3),
(18, '2025-03-07', 'setor modal ', 0.00, 5000000.00, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `akun`
--
ALTER TABLE `akun`
  ADD PRIMARY KEY (`id_akun`);

--
-- Indexes for table `buku_beban`
--
ALTER TABLE `buku_beban`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buku_inventaris`
--
ALTER TABLE `buku_inventaris`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buku_kas`
--
ALTER TABLE `buku_kas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buku_modal`
--
ALTER TABLE `buku_modal`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buku_pendapatan`
--
ALTER TABLE `buku_pendapatan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buku_persediaan`
--
ALTER TABLE `buku_persediaan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buku_piutang`
--
ALTER TABLE `buku_piutang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buku_utang`
--
ALTER TABLE `buku_utang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`);

--
-- Indexes for table `neraca_saldo`
--
ALTER TABLE `neraca_saldo`
  ADD PRIMARY KEY (`id_neraca`),
  ADD KEY `id_akun` (`id_akun`);

--
-- Indexes for table `pengaturan`
--
ALTER TABLE `pengaturan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_akun` (`id_akun`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `akun`
--
ALTER TABLE `akun`
  MODIFY `id_akun` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `buku_beban`
--
ALTER TABLE `buku_beban`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `buku_inventaris`
--
ALTER TABLE `buku_inventaris`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `buku_kas`
--
ALTER TABLE `buku_kas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `buku_modal`
--
ALTER TABLE `buku_modal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `buku_pendapatan`
--
ALTER TABLE `buku_pendapatan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `buku_persediaan`
--
ALTER TABLE `buku_persediaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `buku_piutang`
--
ALTER TABLE `buku_piutang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `buku_utang`
--
ALTER TABLE `buku_utang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `neraca_saldo`
--
ALTER TABLE `neraca_saldo`
  MODIFY `id_neraca` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaturan`
--
ALTER TABLE `pengaturan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `neraca_saldo`
--
ALTER TABLE `neraca_saldo`
  ADD CONSTRAINT `neraca_saldo_ibfk_1` FOREIGN KEY (`id_akun`) REFERENCES `akun` (`id_akun`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_akun`) REFERENCES `akun` (`id_akun`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
