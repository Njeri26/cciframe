-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 07, 2025 at 04:55 AM
-- Server version: 10.6.20-MariaDB-cll-lve
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `checurkt_cca_user_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `host_users`
--

CREATE TABLE `host_users` (
  `userID` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `grade` int(11) NOT NULL,
  `host_token` varchar(255) NOT NULL,
  `iframe_user_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `iframe_user_mapping`
--

CREATE TABLE `iframe_user_mapping` (
  `mapping_id` int(11) NOT NULL,
  `userID` varchar(50) NOT NULL,
  `iframe_user_id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_modified` varchar(30) NOT NULL,
  `user_names` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_auth`
--

CREATE TABLE `user_auth` (
  `entryID` int(11) NOT NULL,
  `userID` varchar(50) NOT NULL,
  `phone_number` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `active_user` varchar(20) NOT NULL DEFAULT 'YES',
  `last_modified` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_auth`
--

INSERT INTO `user_auth` (`entryID`, `userID`, `phone_number`, `password`, `active_user`, `last_modified`) VALUES
(1, 'cheche-1-17032023', '0721859532', '12345678996', 'YES', '17-03-2023 17:13:30'),
(2, 'cheche-2-24032023', '0712054195', 'Njugush92#', 'YES', '24-03-2023 11:43:50'),
(3, 'cheche-3-25032023', '0728465709', '12345678', 'YES', '25-03-2023 12:39:04');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `entryID` int(11) NOT NULL,
  `userID` varchar(50) NOT NULL,
  `user_names` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `user_email` varchar(50) NOT NULL DEFAULT 'NONE',
  `user_age` tinyint(4) NOT NULL DEFAULT 0,
  `phone_verified` varchar(10) NOT NULL DEFAULT 'NO',
  `email_verified` varchar(10) NOT NULL DEFAULT 'NO',
  `last_modified` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`entryID`, `userID`, `user_names`, `phone_number`, `user_email`, `user_age`, `phone_verified`, `email_verified`, `last_modified`) VALUES
(1, 'cheche-1-17032023', 'Kelvin Kungu', '0721859532', 'NONE', 0, 'NO', 'NO', '17-03-2023 17:13:30'),
(2, 'cheche-2-24032023', 'Julius Irungu', '0712054195', 'NONE', 0, 'NO', 'NO', '24-03-2023 11:43:50'),
(3, 'cheche-3-25032023', 'Esborn Kariuki', '0728465709', 'NONE', 0, 'NO', 'NO', '25-03-2023 12:39:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `host_users`
--
ALTER TABLE `host_users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `unique_host_token` (`host_token`),
  ADD UNIQUE KEY `unique_iframe_user_id` (`iframe_user_id`),
  ADD KEY `idx_host_token` (`host_token`),
  ADD KEY `idx_iframe_user_id` (`iframe_user_id`);

--
-- Indexes for table `iframe_user_mapping`
--
ALTER TABLE `iframe_user_mapping`
  ADD PRIMARY KEY (`mapping_id`),
  ADD UNIQUE KEY `unique_host_user` (`userID`),
  ADD UNIQUE KEY `unique_iframe_user` (`iframe_user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_auth`
--
ALTER TABLE `user_auth`
  ADD PRIMARY KEY (`entryID`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`entryID`),
  ADD KEY `idx_userid` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `host_users`
--
ALTER TABLE `host_users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `iframe_user_mapping`
--
ALTER TABLE `iframe_user_mapping`
  MODIFY `mapping_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `iframe_user_mapping`
--
ALTER TABLE `iframe_user_mapping`
  ADD CONSTRAINT `fk_host_user` FOREIGN KEY (`userID`) REFERENCES `user_info` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
