-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2024 at 06:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `barcode` varchar(255) NOT NULL,
  `prod_name` varchar(255) NOT NULL,
  `prod_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`barcode`, `prod_name`, `prod_price`) VALUES
('1001', 'Bulad', 10.00),
('1002', 'Mantika', 30.00),
('1003', 'Noodles', 20.00),
('1004', 'Sabon', 35.00),
('1005', 'Shampoo', 15.00),
('1006', 'Kape', 50.00),
('1007', 'Asukal', 25.00),
('1008', 'Tuyo', 18.00),
('1009', 'Sardinas', 12.00),
('1010', 'Tuna', 40.00),
('1011', 'Bigas', 45.00),
('1012', 'Toyo', 28.00),
('1013', 'Suka', 22.00),
('1014', 'Patis', 33.00),
('1015', 'Saging', 55.00);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sales_id` int(11) NOT NULL,
  `sales_userId` int(11) DEFAULT NULL,
  `sales_cashTendered` decimal(10,2) NOT NULL,
  `sales_change` decimal(10,2) NOT NULL,
  `sales_totalAmount` decimal(10,2) NOT NULL,
  `sales_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sales_id`, `sales_userId`, `sales_cashTendered`, `sales_change`, `sales_totalAmount`, `sales_date`) VALUES
(9, 1, 40.00, 7.00, 33.00, '2024-08-06 14:38:32'),
(10, 1, 250.00, 10.00, 240.00, '2024-08-06 14:40:04'),
(11, 1, 200.00, 0.00, 200.00, '2024-08-07 01:43:38'),
(12, 1, 20.00, 10.00, 10.00, '2024-08-07 02:08:10'),
(13, 2, 10.00, 0.00, 10.00, '2024-08-07 02:57:01'),
(14, 1, 20.00, 0.00, 20.00, '2024-08-07 03:40:17'),
(15, 2, 100.00, 40.00, 60.00, '2024-08-07 04:14:48'),
(16, 2, 100.00, 25.00, 75.00, '2024-08-07 04:18:04'),
(17, 1, 100.00, 28.00, 72.00, '2024-08-07 04:21:27'),
(18, 1, 50.00, 10.00, 40.00, '2024-08-07 04:23:32'),
(19, 1, 40.00, 5.00, 35.00, '2024-08-07 04:23:42'),
(20, 1, 20.00, 0.00, 20.00, '2024-08-07 04:25:53');

-- --------------------------------------------------------

--
-- Table structure for table `sales_item`
--

CREATE TABLE `sales_item` (
  `sales_itemId` int(11) NOT NULL,
  `sales_item_salesId` int(11) DEFAULT NULL,
  `sales_item_prodId` varchar(255) DEFAULT NULL,
  `sales_item_qty` int(11) NOT NULL,
  `sales_item_prc` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_item`
--

INSERT INTO `sales_item` (`sales_itemId`, `sales_item_salesId`, `sales_item_prodId`, `sales_item_qty`, `sales_item_prc`) VALUES
(1, 9, '1014', 1, 33.00),
(2, 10, '1003', 12, 20.00),
(3, 11, '1001', 20, 10.00),
(4, 12, '1001', 1, 10.00),
(5, 13, '1001', 1, 10.00),
(6, 14, '1001', 2, 10.00),
(7, 15, '1001', 1, 10.00),
(8, 15, '1002', 1, 30.00),
(9, 15, '1003', 1, 20.00),
(10, 16, '1003', 1, 20.00),
(11, 16, '1015', 1, 55.00),
(12, 17, '1004', 1, 35.00),
(13, 17, '1005', 1, 15.00),
(14, 17, '1013', 1, 22.00),
(15, 18, '1010', 1, 40.00),
(16, 19, '1004', 1, 35.00),
(17, 20, '1003', 1, 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `fName` varchar(255) NOT NULL,
  `mName` varchar(255) DEFAULT NULL,
  `lName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  `shift` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `fName`, `mName`, `lName`, `password`, `role`, `shift`) VALUES
(1, 'glegaspi', 'Giann', 'Isidore', 'Legaspi', '123', 0, 0),
(2, 'rbaldoza', 'Raz', '', 'Baldoza', '321', 1, 1),
(3, 'jEspartero', 'Jerimiah', '', 'Espartero', '111', 1, 2),
(4, 'cValencia', 'Christian', 'Chris', 'Valencia', '222', 1, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`barcode`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sales_id`),
  ADD KEY `sales_userId` (`sales_userId`);

--
-- Indexes for table `sales_item`
--
ALTER TABLE `sales_item`
  ADD PRIMARY KEY (`sales_itemId`),
  ADD KEY `sales_item_salesId` (`sales_item_salesId`),
  ADD KEY `sales_item_prodId` (`sales_item_prodId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `sales_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `sales_item`
--
ALTER TABLE `sales_item`
  MODIFY `sales_itemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`sales_userId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `sales_item`
--
ALTER TABLE `sales_item`
  ADD CONSTRAINT `sales_item_ibfk_1` FOREIGN KEY (`sales_item_salesId`) REFERENCES `sales` (`sales_id`),
  ADD CONSTRAINT `sales_item_ibfk_2` FOREIGN KEY (`sales_item_prodId`) REFERENCES `products` (`barcode`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
