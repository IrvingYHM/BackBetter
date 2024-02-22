CREATE TABLE tblclientes (
  intClvCliente INT(11) NOT NULL AUTO_INCREMENT,
  vchNomCliente VARCHAR(30) NOT NULL,
  vchAPaterno VARCHAR(30) NOT NULL,
  vchAMaterno VARCHAR(30) NOT NULL,
  vchCorreo VARCHAR(50) NOT NULL,
  chrSexo CHAR(1) NOT NULL,
  dtFechaNacimiento DATE NOT NULL,
  vchTelefono VARCHAR(10) NOT NULL,
  vchPassword VARCHAR(200) NOT NULL,
  Calle VARCHAR(100) NOT NULL,
  intIdColonia INT(11) NOT NULL,
  PRIMARY KEY (intClvCliente)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
