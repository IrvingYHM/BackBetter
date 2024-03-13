/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.4.32-MariaDB : Database - db_honey_b2
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_honey_b2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `db_honey_b2`;

/*Table structure for table `tblempleado` */

DROP TABLE IF EXISTS `tblempleado`;

CREATE TABLE `tblempleado` (
  `intClvEmpleado` int(11) NOT NULL AUTO_INCREMENT,
  `vchNombre` varchar(50) NOT NULL,
  `vchAPaterno` varchar(50) NOT NULL,
  `vchAmaterno` varchar(50) NOT NULL,
  `vchCorreo` varchar(100) NOT NULL,
  `vchTelefono` varchar(10) NOT NULL,
  `chrSexo` char(1) NOT NULL,
  `enEstado` enum('DISPONIBLE','OCUPADO','NO DISPONIBLE') NOT NULL,
  `intClvPuesto` int(11) NOT NULL,
  `dtFechaNacimiento` date NOT NULL,
  `Calle` varchar(100) NOT NULL,
  `intIdColonia` int(11) NOT NULL,
  `vchUsuario` varchar(200) NOT NULL,
  `vchPassword` varchar(200) NOT NULL,
  PRIMARY KEY (`intClvEmpleado`),
  KEY `intClvPuesto` (`intClvPuesto`),
  KEY `intIdColonia` (`Calle`,`intIdColonia`),
  KEY `tblempleado` (`intIdColonia`),
  CONSTRAINT `tblempleado` FOREIGN KEY (`intIdColonia`) REFERENCES `tblcolonia` (`intIdColonia`),
  CONSTRAINT `tblempleado_ibfk_1` FOREIGN KEY (`intClvPuesto`) REFERENCES `tblpuesto` (`intClvPuesto`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblempleado` */

insert  into `tblempleado`(`intClvEmpleado`,`vchNombre`,`vchAPaterno`,`vchAmaterno`,`vchCorreo`,`vchTelefono`,`chrSexo`,`enEstado`,`intClvPuesto`,`dtFechaNacimiento`,`Calle`,`intIdColonia`,`vchUsuario`,`vchPassword`) values (17,'Reyes','Bautista','Rivera','rbr@gmail.com','7713531306','M','NO DISPONIBLE',2,'2003-01-06','Felipe Angeles',29,'ReyBau','7c451ac2bc4b90008c661048da19800c'),(18,'Fortunato','Ramirez','Del Angel','FortR@gmail.com','785963654','M','NO DISPONIBLE',2,'2001-12-01','Javier Rojo Gomez',3,'Forunato123','f10ab26141bb06763ebdbf97878f12e6'),(20,'Julio Cesar','Salazar','Hernandez','Cesar15@gmail.com','7713339902','M','DISPONIBLE',2,'2003-05-15','Zacatecas',2,'JulioCe','julce0101'),(21,'Fernando','Bautista','Hernandez','Fer19@gmail.com','7461182929','M','NO DISPONIBLE',2,'2002-05-19','Michoacan',4,'Ferchis','f42d98738fa3f3e3505e71ed1d5b9fa4'),(22,'Victor','San Juan','Morales','Vic@gmail.com','5585032118','M','OCUPADO',1,'1994-06-20','C. Cuauhtémoc ',4,'Vic20','2af53d50570bac81c9d90864f13b7065'),(23,'Carlos','Lopez','Gutierrez','CarLo@gmail.com','7713567653','M','DISPONIBLE',1,'1995-06-20','Palmas ',1,'Carlitos','3d564d56b2807782fca2ce021eb8fcac'),(25,'Angel','Hernandez','Hernadez','janfg@gmail.com','78563963','M','DISPONIBLE',1,'2004-08-05','C.Hidalgo',8,'Angel','2c5a46ba91c5908d5cdab3db0ffb1d18'),(26,'Alan','Castillo','Noguera','NgAL@gmail.com','7892349065','M','NO DISPONIBLE',1,'2003-01-03','Plutarco',14,'AlanCast','21afefaca407a496545607f26d33e8f6'),(27,'Mariana','Arguelles','Duran','Dur22@gmai.com','7711068821','F','DISPONIBLE',2,'1998-08-22','Luis Velez',22,'MariD','eb38978b8403aa920cb6d257c227b624'),(28,'Angelica','Alvarado','Nava','Angy@gmail.com','7712345567','F','DISPONIBLE',2,'1995-02-07','Hidalgo',8,'AngyAL','201d349df604fa9501f885781e77e870'),(29,'Gabriel','Juarez','Diaz','Gabo@gmail.com','5598786542','M','DISPONIBLE',1,'1993-06-27','Vista albatros',20,'GabJua','8fa3a8be2266d20f57930e8c3e034822'),(30,'Juan','Pérez','Gómez','juan.perez@example.com','555-123-45','M','',1,'1990-05-15','Calle 123',1,'juanperez','4c882dcb24bcb1bc225391a602feca7c');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
