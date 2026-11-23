-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: db_ukksmt3_cepi
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_ledger`
--

DROP TABLE IF EXISTS `_prisma_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_ledger` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) NOT NULL DEFAULT (now(3)),
  `space` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `migration_name` text COLLATE utf8mb4_general_ci NOT NULL,
  `migration_hash` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `origin_core_hash` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `origin_profile_hash` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `destination_core_hash` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `destination_profile_hash` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contract_json_before` longtext COLLATE utf8mb4_general_ci,
  `contract_json_after` longtext COLLATE utf8mb4_general_ci,
  `operations` longtext COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_ledger`
--

LOCK TABLES `_prisma_ledger` WRITE;
/*!40000 ALTER TABLE `_prisma_ledger` DISABLE KEYS */;
INSERT INTO `_prisma_ledger` VALUES (1,'2026-11-17 09:36:27.643','app','','5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3','5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3',NULL,'5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3',NULL,NULL,NULL,'[]'),(2,'2026-11-17 09:37:51.971','app','','5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3','5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3',NULL,'5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3',NULL,NULL,NULL,'[]');
/*!40000 ALTER TABLE `_prisma_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_marker`
--

DROP TABLE IF EXISTS `_prisma_marker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_marker` (
  `space` varchar(191) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'app',
  `core_hash` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `profile_hash` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `contract_json` longtext COLLATE utf8mb4_general_ci,
  `canonical_version` int DEFAULT NULL,
  `updated_at` datetime(3) NOT NULL DEFAULT (now(3)),
  `app_tag` text COLLATE utf8mb4_general_ci,
  `meta` text COLLATE utf8mb4_general_ci NOT NULL DEFAULT (_utf8mb4'{}'),
  `invariants` text COLLATE utf8mb4_general_ci NOT NULL DEFAULT (_utf8mb4'[]'),
  PRIMARY KEY (`space`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_marker`
--

LOCK TABLES `_prisma_marker` WRITE;
/*!40000 ALTER TABLE `_prisma_marker` DISABLE KEYS */;
INSERT INTO `_prisma_marker` VALUES ('app','5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3','5212eb1a1220f2d24de13f4efadd4c703f3a1098a5f57e09da0dc26ebb7201d0',NULL,NULL,'2026-11-17 09:37:51.964',NULL,'{}','[]');
/*!40000 ALTER TABLE `_prisma_marker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff',
  `token` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `kode_user` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_kode_user_key` (`kode_user`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (13,'cepihandani','cepihandani@gmail.com','scrypt:905bf7ee08e25b8e2dd3122978072beb:b2a0518a61ac1e810375b68169eb7693e0046327dfac6c07066deb1e440cfcc33ab715925183dd92fc2ebaec7c850ea681e16621f35cd8de81b740ce050e1f45','admin','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMyIsImVtYWlsIjoiY2VwaWhhbmRhbmlAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzk1MTQ2NjAwLCJleHAiOjE3OTUyMzMwMDB9.Eh6jSx6B3U3t4PIpmhxtfAUDuhGNXNub4iFbIdkGL9Q','2026-11-19 05:59:49.344','2026-11-20 03:50:00.497','ADM001'),(14,'farhan','farhan@gmail.com','scrypt:1f8820ceb902ef9d0673147481d32302:283a433030960b6de39eaa7a34040f07b0693ccfb52b1174fb04ebac4318bd29dac4221cd53fc610ddd86a87cc9d7068c6322bbaed009f40837b56e4376be065','staff',NULL,'2026-11-19 06:00:15.345','2026-11-20 03:04:21.515','STF001');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'db_ukksmt3_cepi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-21 19:50:11
