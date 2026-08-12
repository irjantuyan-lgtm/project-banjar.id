-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 10, 2026 at 01:04 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `banjar_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `banjar`
--

CREATE TABLE `banjar` (
  `id_banjar` bigint UNSIGNED NOT NULL,
  `nama_banjar` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `negara` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Indonesia',
  `provinsi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kota` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `link_peta` text COLLATE utf8mb4_unicode_ci,
  `no_wa_pengelola` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_views` int DEFAULT '0',
  `total_bintang` int DEFAULT '0',
  `jumlah_perating` int DEFAULT '0',
  `total_likes` int DEFAULT '0',
  `status_akun` enum('aktif','pending','suspend','ditolak') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `admin_id` bigint DEFAULT NULL,
  `kode_verifikasi` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kecamatan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banjar`
--

INSERT INTO `banjar` (`id_banjar`, `nama_banjar`, `negara`, `provinsi`, `kota`, `deskripsi`, `latitude`, `longitude`, `link_peta`, `no_wa_pengelola`, `total_views`, `total_bintang`, `jumlah_perating`, `total_likes`, `status_akun`, `created_at`, `updated_at`, `admin_id`, `kode_verifikasi`, `foto_profil`, `kecamatan`) VALUES
(1, 'krenang', 'Indonesia', 'South Kalimantan', 'Kabupaten Kota Baru', 'selamat datang di Banjar Krenang', -3.23846100, 116.22359400, NULL, '083232434334', 56, 18, 4, 4, 'aktif', '2026-07-16 17:33:04', '2026-08-09 13:25:02', 5, 'E5BA75', 'profil_banjar/TraEcs3KHlVj6V9IOTyaCpQXHfvihX6tCb3eGcFW.jpg', NULL),
(2, 'Desta Erlangga Ramadhani', 'Afghanistan', 'Badakhshan', 'Ashkāsham', 'selamat datang', NULL, NULL, NULL, '081233421237', 0, 0, 0, 0, 'pending', '2026-07-27 23:53:38', '2026-07-28 07:53:44', 6, '590BD3', NULL, NULL),
(3, 'banjarakan', 'Indonesia', 'Bali', 'Kabupaten Buleleng', '<p>selamat&nbsp;datang&nbsp;di&nbsp;banjarakan&nbsp;</p>', NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'pending', '2026-07-30 18:45:06', '2026-07-31 02:45:06', 12, NULL, NULL, 'kecamatan buleleng'),
(5, 'sasetan', 'Indonesia', 'Aceh', 'Kabupaten Aceh Barat', '<p>selamat&nbsp;datang</p>', 5.56110050, 95.28750260, NULL, '082146789679', 6, 0, 0, 1, 'aktif', '2026-07-30 20:00:55', '2026-08-10 00:43:13', 13, '46EA4D', NULL, 'kecamatan aceh');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-kode_banjar_1', 's:6:\"E5BA75\";', 1785756469),
('laravel-cache-kode_banjar_5', 's:6:\"46EA4D\";', 1785756509);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kegiatan`
--

CREATE TABLE `kegiatan` (
  `id_kegiatan` bigint UNSIGNED NOT NULL,
  `id_banjar` bigint UNSIGNED NOT NULL,
  `judul_kegiatan` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `lokasi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_kegiatan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `status_moderasi` enum('draft','pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `catatan_moderasi` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kegiatan`
--

INSERT INTO `kegiatan` (`id_kegiatan`, `id_banjar`, `judul_kegiatan`, `deskripsi`, `lokasi`, `foto_kegiatan`, `tanggal`, `status_moderasi`, `catatan_moderasi`, `created_at`, `updated_at`) VALUES
(3, 1, 'bnvbn n', 'ghghvhgcv', NULL, NULL, '2026-07-29', 'approved', 'hascbdhdhbdhbjdbhjb scsd', '2026-07-25 00:22:55', '2026-07-27 01:57:14'),
(4, 1, 'meperoras', 'Tujuan dari upacara ini adalah menjaga keseimbangan alam semesta maupun diri manusia dari gangguan Bhuta Kala. Ritual ini dimulai dengan menyebarkan nasi tawur, mengobori rumah dan seluruh pekarangan, menyemburi rumah, dan memukul kentongan hingga gaduh.', NULL, 'kegiatan_foto/yBkWkk35YXsJx5VNDkpZkZC9l7IbTF58EOncdYaI.jpg', '2026-07-31', 'pending', NULL, '2026-07-29 18:48:06', '2026-07-30 04:46:27');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_07_18_004135_add_link_peta_to_banjar_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `id_banjar` bigint UNSIGNED NOT NULL,
  `bintang` tinyint NOT NULL,
  `komentar` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `user_id`, `id_banjar`, `bintang`, `komentar`, `created_at`, `updated_at`) VALUES
(1, 7, 1, 5, NULL, '2026-07-29 16:56:18', '2026-07-29 16:56:18');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('a95C8AJzgdf0k7iiFicFkTolJWDf2vS038aXdPUS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'eyJfdG9rZW4iOiJqajFwMGs0Vkp4aEJ1S3RmeTR4Y3AzQ2s5N3B4cDhwa1M2VmowMXpGIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJ1cmwiOnsiaW50ZW5kZWQiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYWRtaW5cL3Byb2ZpbCJ9LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvbG9jYWxob3N0OjgwMDAiLCJyb3V0ZSI6bnVsbH0sImxvY2FsZSI6ImlkIn0=', 1786323374);

-- --------------------------------------------------------

--
-- Table structure for table `umkm`
--

CREATE TABLE `umkm` (
  `id_umkm` bigint UNSIGNED NOT NULL,
  `id_banjar` bigint UNSIGNED NOT NULL,
  `nama_usaha` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi_produk` text COLLATE utf8mb4_unicode_ci,
  `lokasi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `harga` int DEFAULT NULL,
  `foto_produk` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_wa_penjual` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_moderasi` enum('draft','pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `catatan_moderasi` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `umkm`
--

INSERT INTO `umkm` (`id_umkm`, `id_banjar`, `nama_usaha`, `deskripsi_produk`, `lokasi`, `harga`, `foto_produk`, `no_wa_penjual`, `status_moderasi`, `catatan_moderasi`, `created_at`, `updated_at`) VALUES
(1, 1, 'yjhjhk', 'hjhjkjk', NULL, 10000, NULL, '08977687856687', 'approved', 'vghhhhcfg', '2026-07-26 21:20:42', '2026-07-27 05:29:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','admin_banjar','anggota_banjar','warga') COLLATE utf8mb4_unicode_ci DEFAULT 'warga',
  `id_banjar` bigint UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status_akun` enum('aktif','pending','suspend','ditolak') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `role`, `id_banjar`, `remember_token`, `created_at`, `updated_at`, `status_akun`) VALUES
(2, 'Super Admin', 'superadmin', 'superadmin@gmail.com', '$2y$12$1XYJuhMus91exUl5we8.RuKDo3FWw7O46.6j5nCB7t.dj/oPUiwTq', 'super_admin', NULL, 'CJVboCNjwfYtvREE9BnHag78DmH7ODghiwCOk8aO9XoMvMPoc35RD2WFpnhs', '2026-07-14 20:49:49', '2026-08-03 09:32:32', 'aktif'),
(4, 'Super Admin', 'superadmin1', 'superadmin1@gmail.com', '$2y$12$YwJu6BgAxZOA4EgdoVl6KOd86uwarufgfJFL7PvqSGScjBGbnUBJ6', 'super_admin', NULL, NULL, '2026-07-14 22:57:52', '2026-07-15 06:57:52', 'aktif'),
(5, 'desta', 'admin_kaja', 'destaerlanggaramadhani@gmail.com', '$2y$12$TlcsUo0hGYIX5BIFsc9n3eha5ejoE0w025FRGTYwa0nAu8QKa83Sa', 'admin_banjar', NULL, 'HinFLHdRj0BlfzlPRz2NMdYEaKNTsoYEXSgp1LI8ABCTLDOwGQm9CrGHQLaP', '2026-07-15 23:31:58', '2026-08-03 11:23:10', 'aktif'),
(6, 'desta', 'desta', 'irjantuyan@gmail.com', '$2y$12$TFDwDWZFQosz6q0qfN4fsOdEVoG3oF.wn8TYhEXV7DsKiB0ffsO/u', 'admin_banjar', NULL, '9qXocytNblGSKxdinDWuDSz10zvSivfxpGWoj6UDQionEWXnKfPM8etc14Yc', '2026-07-27 21:12:43', '2026-07-29 00:24:39', 'pending'),
(7, 'Desta Erlangga Ramadhani', 'desta12345', 'destaerlanggaramadhani@outlook.com', '$2y$12$tP2Tnu2rkcjlM/MLlhKUGulq9ntdcFRBIKyhv5gCqzMbHYjOQqTRy', 'warga', NULL, NULL, '2026-07-29 16:56:02', '2026-07-30 00:56:02', 'aktif'),
(8, 'Yatin', 'yatina', 'yatinadewi699@gmail.com', '$2y$12$CRLIUnuIpnB/M8lT2sxvf.Tsg/WEjyIRV/1QmxWl8GckB.Tb783X2', 'warga', NULL, NULL, '2026-07-29 19:30:14', '2026-07-30 03:30:14', 'aktif'),
(9, 'Yatinadewi', 'dewi123', 'yatina234@gmail.com', '$2y$12$yWc1UIxGOaDGhIBofVsb9eV2OppenW17Chvs/fNxqTuLKA3kEfAeK', 'warga', 1, 'AWH3wZlAEk1SQluitdnuahcUyZBsjAFzLYgfjQuTjL1RqnAI8TQDIQiKRMom', '2026-07-29 19:57:00', '2026-08-10 00:07:37', 'aktif'),
(10, 'wayan1', 'wayan111', 'wayan23@gmail.com', '$2y$12$C81jGNlfi5qBCk24m/26mOWP5FHkrvKtAbXTvKDp7LRqv2gULHGAS', 'anggota_banjar', 1, 'q5oNFScd52F85SCtRnBBCy6AIxJyHzMLCfC8zvQOESzcZ00pSWDrhSqvM6he', '2026-07-29 20:13:29', '2026-07-30 07:23:14', 'aktif'),
(12, 'Desta Desta', 'desta123', 'desta.baru@gmail.com', '$2y$12$JCRrdnNzAhlSctGfsJmJFuw9r4a/EaY5R48i1VrJz2zqiQmPVplwq', 'admin_banjar', 3, NULL, '2026-07-30 18:45:06', '2026-07-31 02:45:06', 'pending'),
(13, 'Kadek arnata', 'kadek', 'kadek@gmail.com', '$2y$12$Xt2NuOMdDp9MLWe9KN/qau5Gj36KSW9v38gFsGpKMOnCsugD/xaeG', 'admin_banjar', 5, '6hkc7SOLxA7uY4kU2HHd1jy0ykGUWBcYb3wKHKPNbJdXFQOqXTlUMw2Gksla', '2026-07-30 20:00:55', '2026-08-10 00:44:00', 'aktif'),
(14, 'Yanto', 'yanto123', 'yanto@gmail.com', '$2y$12$thX7m/.rdycjPpza.cg/f.EreJNjZGDFgwGiEK2vBTm90K1CsoJ9G', 'anggota_banjar', 1, 'ZhqXMQMwVmi49d6Cib61RbLJCJNzNJCLaW7PVEDRbXJRTW0YAkQyDgQ1gyvn', '2026-07-30 21:45:24', '2026-08-09 14:56:22', 'aktif');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banjar`
--
ALTER TABLE `banjar`
  ADD PRIMARY KEY (`id_banjar`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `kegiatan`
--
ALTER TABLE `kegiatan`
  ADD PRIMARY KEY (`id_kegiatan`),
  ADD KEY `id_banjar` (`id_banjar`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rating` (`user_id`,`id_banjar`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `umkm`
--
ALTER TABLE `umkm`
  ADD PRIMARY KEY (`id_umkm`),
  ADD KEY `id_banjar` (`id_banjar`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_ke_banjar` (`id_banjar`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banjar`
--
ALTER TABLE `banjar`
  MODIFY `id_banjar` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kegiatan`
--
ALTER TABLE `kegiatan`
  MODIFY `id_kegiatan` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `umkm`
--
ALTER TABLE `umkm`
  MODIFY `id_umkm` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kegiatan`
--
ALTER TABLE `kegiatan`
  ADD CONSTRAINT `kegiatan_ibfk_1` FOREIGN KEY (`id_banjar`) REFERENCES `banjar` (`id_banjar`) ON DELETE CASCADE;

--
-- Constraints for table `umkm`
--
ALTER TABLE `umkm`
  ADD CONSTRAINT `umkm_ibfk_1` FOREIGN KEY (`id_banjar`) REFERENCES `banjar` (`id_banjar`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_ke_banjar` FOREIGN KEY (`id_banjar`) REFERENCES `banjar` (`id_banjar`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_banjar`) REFERENCES `banjar` (`id_banjar`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
