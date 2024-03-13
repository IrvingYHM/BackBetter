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

/*Table structure for table `persons` */

DROP TABLE IF EXISTS `persons`;

CREATE TABLE `persons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `persons` */

/*Table structure for table `tblcita` */

DROP TABLE IF EXISTS `tblcita`;

CREATE TABLE `tblcita` (
  `IdCita` int(5) NOT NULL AUTO_INCREMENT,
  `Fecha` date DEFAULT NULL,
  `Hora` time DEFAULT NULL,
  `idCliente` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdCita`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblcita` */

insert  into `tblcita`(`IdCita`,`Fecha`,`Hora`,`idCliente`) values (1,'2024-03-05','14:00:00',1);

/*Table structure for table `tblciudad` */

DROP TABLE IF EXISTS `tblciudad`;

CREATE TABLE `tblciudad` (
  `IdCiudad` int(5) NOT NULL AUTO_INCREMENT,
  `NombreCiudad` varchar(255) DEFAULT NULL,
  `idEstado` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdCiudad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblciudad` */

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
  `vchPreguntaSecreta` varchar(255) DEFAULT NULL,
  `vchRespuestaSecreta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`intClvCliente`),
  KEY `intIdColonia` (`intIdColonia`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblclientes` */

insert  into `tblclientes`(`intClvCliente`,`vchNomCliente`,`vchAPaterno`,`vchAMaterno`,`vchCorreo`,`chrSexo`,`dtFechaNacimiento`,`vchTelefono`,`vchPassword`,`Calle`,`intIdColonia`,`vchPreguntaSecreta`,`vchRespuestaSecreta`) values (1,'Julio Cesar','Salazar','Hernandez','20210709@uthh.edu.mx','M','2003-05-15','7712036621','$2a$10$9TAu5lGRdFWzjS7Z5bGf4ORtuEEin7RVjP0JTHzeOtNxYAGLNyLGa','Valle del encinal',0,'¿El nombre de tu mejor amigo?','Angel');

/*Table structure for table `tblcodigos_recuperacion` */

DROP TABLE IF EXISTS `tblcodigos_recuperacion`;

CREATE TABLE `tblcodigos_recuperacion` (
  `IdCodigoRecuperacion` int(11) NOT NULL AUTO_INCREMENT,
  `Codigo` varchar(255) DEFAULT NULL,
  `HoraExpiracion` time NOT NULL,
  `Correo_electronico` varchar(255) NOT NULL,
  PRIMARY KEY (`IdCodigoRecuperacion`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblcodigos_recuperacion` */

insert  into `tblcodigos_recuperacion`(`IdCodigoRecuperacion`,`Codigo`,`HoraExpiracion`,`Correo_electronico`) values (1,'262508','23:11:39','20210709@uthh.edu.mx'),(2,'300503','22:20:53','20210709@uthh.edu.mx');

/*Table structure for table `tblcolonia` */

DROP TABLE IF EXISTS `tblcolonia`;

CREATE TABLE `tblcolonia` (
  `IdColonia` int(5) NOT NULL AUTO_INCREMENT,
  `NombreColonia` varchar(255) DEFAULT NULL,
  `idCiudad` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdColonia`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblcolonia` */

insert  into `tblcolonia`(`IdColonia`,`NombreColonia`,`idCiudad`) values (1,'Valle del encinal',NULL);

/*Table structure for table `tblempleado` */

DROP TABLE IF EXISTS `tblempleado`;

CREATE TABLE `tblempleado` (
  `intClvEmpleado` int(11) NOT NULL AUTO_INCREMENT,
  `vchNombre` varchar(255) NOT NULL,
  `vchAPaterno` varchar(255) NOT NULL,
  `vchAMaterno` varchar(255) NOT NULL,
  `vchCorreo` varchar(100) NOT NULL,
  `dtFechaNacimiento` datetime NOT NULL,
  `vchTelefono` varchar(50) NOT NULL,
  `chrSexo` char(1) NOT NULL,
  `enEstado` enum('DISPONIBLE','OCUPADO','NO DISPONIBLE') NOT NULL,
  `vchPassword` varchar(200) NOT NULL,
  `vchPreguntaSecreta` varchar(100) NOT NULL,
  `vchRespuestaSecreta` varchar(100) NOT NULL,
  `Calle` varchar(100) NOT NULL,
  PRIMARY KEY (`intClvEmpleado`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblempleado` */

insert  into `tblempleado`(`intClvEmpleado`,`vchNombre`,`vchAPaterno`,`vchAMaterno`,`vchCorreo`,`dtFechaNacimiento`,`vchTelefono`,`chrSexo`,`enEstado`,`vchPassword`,`vchPreguntaSecreta`,`vchRespuestaSecreta`,`Calle`) values (1,'Juan','Pérez','López','juanperez@hotmail.com','1990-01-01 00:00:00','1234567890','M','DISPONIBLE','$2a$10$T39i2ANDOOZRg0d1K28caOPgXN4D9EC2tD9GPvfsNETFH.TuPvNaS','¿Cuál es el nombre de tu mascota?','Firulais','Calle 123');

/*Table structure for table `tblestado` */

DROP TABLE IF EXISTS `tblestado`;

CREATE TABLE `tblestado` (
  `IdEstado` int(5) NOT NULL AUTO_INCREMENT,
  `NombreEstado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdEstado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblestado` */

/*Table structure for table `tblinventario` */

DROP TABLE IF EXISTS `tblinventario`;

CREATE TABLE `tblinventario` (
  `IdInventario` int(11) NOT NULL AUTO_INCREMENT,
  `IdProducto` int(11) NOT NULL,
  `Existencias` int(11) DEFAULT NULL,
  `CostoFabricacion` decimal(10,2) DEFAULT NULL,
  `MargenUtilidad` decimal(10,2) DEFAULT NULL,
  `CostoVenta` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`IdInventario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblinventario` */

/*Table structure for table `tblmetodopago` */

DROP TABLE IF EXISTS `tblmetodopago`;

CREATE TABLE `tblmetodopago` (
  `IdTipoPago` int(11) NOT NULL AUTO_INCREMENT,
  `TipoPago` varchar(255) DEFAULT NULL,
  `vchDescripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdTipoPago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblmetodopago` */

/*Table structure for table `tblpedido_detalle` */

DROP TABLE IF EXISTS `tblpedido_detalle`;

CREATE TABLE `tblpedido_detalle` (
  `IdPedidoDetalle` int(11) NOT NULL AUTO_INCREMENT,
  `IdPedido` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `CantidadProductos` float DEFAULT NULL,
  `Precio` decimal(10,2) DEFAULT NULL,
  `Iva` decimal(10,2) DEFAULT NULL,
  `SubTotal` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`IdPedidoDetalle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblpedido_detalle` */

/*Table structure for table `tblproductos` */

DROP TABLE IF EXISTS `tblproductos`;

CREATE TABLE `tblproductos` (
  `IdProducto` int(11) NOT NULL AUTO_INCREMENT,
  `vchNombreProducto` varchar(50) NOT NULL,
  `vchNomImagen` varchar(30) NOT NULL,
  `vchDescripcion` varchar(100) NOT NULL,
  PRIMARY KEY (`IdProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblproductos` */

insert  into `tblproductos`(`IdProducto`,`vchNombreProducto`,`vchNomImagen`,`vchDescripcion`) values (1,'Lentes de sol','','Lentes de sol 100% original'),(2,'Lentes de sol','imagen.png','Lentes solo para el sol xd'),(3,'Lentes opticos','imagen2.png','Lentes opticos xd');

/*Table structure for table `tblvaloracion` */

DROP TABLE IF EXISTS `tblvaloracion`;

CREATE TABLE `tblvaloracion` (
  `IdVaLPro` int(11) NOT NULL AUTO_INCREMENT,
  `Comentario` varchar(255) DEFAULT NULL,
  `Puntuacion` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  PRIMARY KEY (`IdVaLPro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tblvaloracion` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
