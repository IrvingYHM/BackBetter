/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.4.32-MariaDB : Database - opticenter
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`opticenter` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `opticenter`;

/*Table structure for table `tblclientes` */

DROP TABLE IF EXISTS `tblclientes`;

CREATE TABLE `tblclientes` (
  `intClvCliente` int(11) NOT NULL AUTO_INCREMENT,
  `vchNomCliente` varchar(30) NOT NULL,
  `vchAPaterno` varchar(30) NOT NULL,
  `vchAMaterno` varchar(30) NOT NULL,
  `vchCorreo` varchar(50) NOT NULL,
  `chrSexo` char(1) NOT NULL,
  `dtFechaNacimiento` date NOT NULL,
  `vchTelefono` varchar(10) NOT NULL,
  `vchPassword` varchar(200) NOT NULL,
  `Calle` varchar(100) NOT NULL,
  `intIdColonia` int(11) NOT NULL,
  `vchPreguntaSecreta` varchar(100) NOT NULL,
  `vchRespuestaSecreta` varchar(100) NOT NULL,
  PRIMARY KEY (`intClvCliente`),
  KEY `intIdColonia` (`intIdColonia`),
  CONSTRAINT `tblclientes_ibfk_1` FOREIGN KEY (`intIdColonia`) REFERENCES `tblcolonia` (`intIdColonia`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblclientes` */

insert  into `tblclientes`(`intClvCliente`,`vchNomCliente`,`vchAPaterno`,`vchAMaterno`,`vchCorreo`,`chrSexo`,`dtFechaNacimiento`,`vchTelefono`,`vchPassword`,`Calle`,`intIdColonia`,`vchPreguntaSecreta`,`vchRespuestaSecreta`) values (9,'leidy','Salazar','hernandez','leidy@hotmail.com','F','2005-01-15','7783223432','leidy0101','palmas',1,'',''),(21,'Itzel','Martinez','Doroteo','doroteo@example.com','F','1990-01-01','1234567890','$2b$10$4DyE75oNZYOoTq.JInBlJeJPlvUPEQXS.0IqLa51TvXJj/oS0JMy2','Calle Falsa 123',1,'',''),(22,'Itzel','Martinez','Doroteo','doroteo@example.com','F','1990-01-01','1234567890','$2b$10$pFgFi/fQJ68McQhkFyv36.QFmUqomypmVg39oCXekAB06vzr38tCe','Calle Falsa 123',1,'Mejor amigo','Jose'),(23,'Julio Cesar','Salazar','Hernandez','20210709@uthh.edu.mx','M','2003-05-15','7712036621','$2b$10$DNNLrWfssvZSoGfrMf/zOurUD.3Bv.Po1CKMdojro5UXBqrLyD/Sm','palmas',1,'','Azul');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
