/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.6.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: practica
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `characterlikes`
--

DROP TABLE IF EXISTS `characterlikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `characterlikes` (
  `character_id` int(11) NOT NULL,
  `character_name` varchar(255) NOT NULL,
  `like_count` int(11) NOT NULL,
  PRIMARY KEY (`character_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characterlikes`
--

LOCK TABLES `characterlikes` WRITE;
/*!40000 ALTER TABLE `characterlikes` DISABLE KEYS */;
INSERT INTO `characterlikes` VALUES
(1009146,'Abomination (Emil Blonsky)',1),
(1009148,'Absorbing Man',1),
(1011334,'3-D Man',2),
(1016823,'Abomination (Ultimate)',1),
(1017100,'A-Bomb (HAS)',2);
/*!40000 ALTER TABLE `characterlikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movielikes`
--

DROP TABLE IF EXISTS `movielikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movielikes` (
  `movie_id` int(11) NOT NULL,
  `like_count` int(11) NOT NULL,
  `movie_name` varchar(255) NOT NULL,
  PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movielikes`
--

LOCK TABLES `movielikes` WRITE;
/*!40000 ALTER TABLE `movielikes` DISABLE KEYS */;
INSERT INTO `movielikes` VALUES
(13363,1,'The Man from Earth'),
(29917,1,'Exam'),
(539972,1,'Kraven the Hunter'),
(762509,1,'Mufasa: The Lion King'),
(845781,3,'Red One'),
(912649,1,'Venom: The Last Dance'),
(933260,1,'The Substance'),
(974453,1,'Absolution'),
(1034541,2,'Terrifier 3'),
(1035048,1,'Elevation'),
(1100782,1,'Smile 2'),
(1196080,1,'EXAM'),
(1241982,1,'Moana 2');
/*!40000 ALTER TABLE `movielikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercharacterlikes`
--

DROP TABLE IF EXISTS `usercharacterlikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usercharacterlikes` (
  `id_like` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `character_id` int(11) NOT NULL,
  `liked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `character_name` varchar(255) NOT NULL,
  `action` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_like`),
  UNIQUE KEY `user_id` (`user_id`,`character_id`),
  UNIQUE KEY `user_id_2` (`user_id`,`character_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercharacterlikes`
--

LOCK TABLES `usercharacterlikes` WRITE;
/*!40000 ALTER TABLE `usercharacterlikes` DISABLE KEYS */;
INSERT INTO `usercharacterlikes` VALUES
(1,2,1011334,'2024-12-18 16:08:06','3-D Man',1),
(2,2,1017100,'2024-12-18 16:08:09','A-Bomb (HAS)',1);
/*!40000 ALTER TABLE `usercharacterlikes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER tr_usercharacterlikes_log_insert
AFTER INSERT ON usercharacterlikes
FOR EACH ROW
BEGIN
    INSERT INTO usercharacterlikeslog (
        id_like,
        user_id,
        character_id,
        character_name,
        liked_at,
        action
    )
    VALUES (
        NEW.id_like,
        NEW.user_id,
        NEW.character_id,
        NEW.character_name,
        NEW.liked_at,
        NEW.action
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER tr_usercharacterlikes_log_update
AFTER UPDATE ON usercharacterlikes
FOR EACH ROW
BEGIN
    INSERT INTO usercharacterlikeslog (
        id_like,
        user_id,
        character_id,
        character_name,
        liked_at,
        action
    )
    VALUES (
        NEW.id_like,
        NEW.user_id,
        NEW.character_id,
        NEW.character_name,
        NEW.liked_at,
        NEW.action
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `usercharacterlikeslog`
--

DROP TABLE IF EXISTS `usercharacterlikeslog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usercharacterlikeslog` (
  `id_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_like` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `character_id` int(11) NOT NULL,
  `liked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `character_name` varchar(255) NOT NULL,
  `action` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_log`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercharacterlikeslog`
--

LOCK TABLES `usercharacterlikeslog` WRITE;
/*!40000 ALTER TABLE `usercharacterlikeslog` DISABLE KEYS */;
INSERT INTO `usercharacterlikeslog` VALUES
(1,1,2,1011334,'2024-12-18 16:08:06','3-D Man',1),
(2,2,2,1017100,'2024-12-18 16:08:09','A-Bomb (HAS)',1);
/*!40000 ALTER TABLE `usercharacterlikeslog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usermovielikes`
--

DROP TABLE IF EXISTS `usermovielikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usermovielikes` (
  `id_like` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `movie_name` varchar(255) NOT NULL,
  `liked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `action` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_like`),
  UNIQUE KEY `user_id` (`user_id`,`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usermovielikes`
--

LOCK TABLES `usermovielikes` WRITE;
/*!40000 ALTER TABLE `usermovielikes` DISABLE KEYS */;
INSERT INTO `usermovielikes` VALUES
(1,2,1035048,'Elevation','2024-12-18 14:25:34',1),
(2,2,845781,'Red One','2024-12-18 14:35:22',1),
(3,2,1241982,'Moana 2','2024-12-18 14:35:24',1),
(4,2,762509,'Mufasa: The Lion King','2024-12-18 14:35:26',1),
(5,5,912649,'Venom: The Last Dance','2024-12-18 15:49:02',1),
(6,5,845781,'Red One','2024-12-18 15:49:02',1),
(7,5,762509,'Mufasa: The Lion King','2024-12-18 15:49:04',0),
(8,5,539972,'Kraven the Hunter','2024-12-18 15:49:06',1),
(9,5,933260,'The Substance','2024-12-18 15:49:07',1),
(10,5,1100782,'Smile 2','2024-12-18 15:49:08',1),
(11,5,1034541,'Terrifier 3','2024-12-18 15:49:09',1),
(13,2,974453,'Absolution','2024-12-18 17:07:14',1),
(14,6,845781,'Red One','2024-12-18 17:18:22',1),
(15,6,1034541,'Terrifier 3','2024-12-18 17:18:53',1),
(16,7,845781,'Red One','2024-12-18 17:25:24',0),
(22,7,29917,'Exam','2024-12-18 17:28:28',1),
(23,7,13363,'The Man from Earth','2024-12-18 17:31:09',1),
(24,7,1196080,'EXAM','2024-12-18 17:54:44',1);
/*!40000 ALTER TABLE `usermovielikes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER tr_usermovielikes_log_insert
AFTER INSERT ON usermovielikes
FOR EACH ROW
BEGIN
    INSERT INTO usermovielikeslog (
        id_like,
        user_id,
        movie_id,
        movie_name,
        liked_at,
        action
    )
    VALUES (
        NEW.id_like,
        NEW.user_id,
        NEW.movie_id,
        NEW.movie_name,
        NEW.liked_at,
        NEW.action
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER tr_usermovielikes_log_update
AFTER UPDATE ON usermovielikes
FOR EACH ROW
BEGIN
    INSERT INTO usermovielikeslog (
        id_like,
        user_id,
        movie_id,
        movie_name,
        liked_at,
        action
    )
    VALUES (
        NEW.id_like,
        NEW.user_id,
        NEW.movie_id,
        NEW.movie_name,
        NEW.liked_at,
        NEW.action
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `usermovielikeslog`
--

DROP TABLE IF EXISTS `usermovielikeslog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usermovielikeslog` (
  `id_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_like` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `movie_name` varchar(255) NOT NULL,
  `liked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `action` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_log`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usermovielikeslog`
--

LOCK TABLES `usermovielikeslog` WRITE;
/*!40000 ALTER TABLE `usermovielikeslog` DISABLE KEYS */;
INSERT INTO `usermovielikeslog` VALUES
(1,1,2,1035048,'Elevation','2024-12-18 14:25:34',1),
(2,2,2,845781,'Red One','2024-12-18 14:35:22',1),
(3,3,2,1241982,'Moana 2','2024-12-18 14:35:24',1),
(4,4,2,762509,'Mufasa: The Lion King','2024-12-18 14:35:26',1),
(5,5,5,912649,'Venom: The Last Dance','2024-12-18 15:49:02',1),
(6,6,5,845781,'Red One','2024-12-18 15:49:02',1),
(7,7,5,762509,'Mufasa: The Lion King','2024-12-18 15:49:04',1),
(8,8,5,539972,'Kraven the Hunter','2024-12-18 15:49:06',1),
(9,9,5,933260,'The Substance','2024-12-18 15:49:07',1),
(10,10,5,1100782,'Smile 2','2024-12-18 15:49:08',1),
(11,11,5,1034541,'Terrifier 3','2024-12-18 15:49:09',1),
(12,7,5,762509,'Mufasa: The Lion King','2024-12-18 15:49:04',0),
(13,13,2,974453,'Absolution','2024-12-18 17:07:14',1),
(14,14,6,845781,'Red One','2024-12-18 17:18:22',1),
(15,15,6,1034541,'Terrifier 3','2024-12-18 17:18:53',1),
(16,16,7,845781,'Red One','2024-12-18 17:25:24',1),
(17,16,7,845781,'Red One','2024-12-18 17:25:24',0),
(18,16,7,845781,'Red One','2024-12-18 17:25:24',1),
(19,16,7,845781,'Red One','2024-12-18 17:25:24',0),
(20,16,7,845781,'Red One','2024-12-18 17:25:24',1),
(21,16,7,845781,'Red One','2024-12-18 17:25:24',0),
(22,22,7,29917,'Exam','2024-12-18 17:28:28',1),
(23,23,7,13363,'The Man from Earth','2024-12-18 17:31:09',1),
(24,24,7,1196080,'EXAM','2024-12-18 17:54:44',1);
/*!40000 ALTER TABLE `usermovielikeslog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `correo` varchar(200) NOT NULL,
  `clave` varchar(256) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES
(1,'admin@admin.com','admin',1),
(2,'af3392976@gmail.com','9ba547072e38495c40268a37a32d5a44d0da57fd31f945ad31a2ee669be6a3da',1),
(3,'af33929715@gmail.com','c0aca55cc7de7aa7ca5857ee8dc0b48f702a20405dc19938e6afb640c12dbad9',0),
(4,'4','c0aca55cc7de7aa7ca5857ee8dc0b48f702a20405dc19938e6afb640c12dbad9',0),
(5,'af3392979@gmail.com','9ba547072e38495c40268a37a32d5a44d0da57fd31f945ad31a2ee669be6a3da',1),
(6,'jennifereden45@gmail.com','6b943aa9b2dc7d6f2f04a83c1f4c2cf5faa111a521c16581e2905630a2c6991b',1),
(7,'cesar.rsz@hotmail.com','d74fe97872d8a425b5263add13d51a1066bf0b2cdd5e368d316dfe31048b2104',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-12-18 12:03:46
