-- Script para agregar el campo imagenPortada a la tabla tblCatalogos
-- Simplificado para manejo manual de URLs de PDF y subida de imágenes de portada
-- Ejecutar este script en la base de datos

USE railway;

-- Agregar la nueva columna imagenPortada
ALTER TABLE tblCatalogos 
ADD COLUMN imagenPortada VARCHAR(255) NULL 
COMMENT 'URL de la imagen de portada del catálogo almacenada en Cloudinary';

-- Verificar que la columna se agregó correctamente
DESCRIBE tblCatalogos;

-- Comentarios sobre el nuevo flujo:
-- 1. vchCatalogo: URL manual del PDF subido a Google Drive por el usuario
-- 2. imagenPortada: URL de imagen de portada generada por Cloudinary
-- 3. vchFileId: Se mantiene por compatibilidad pero ya no se usa para nuevos registros

-- Estructura final esperada:
-- IdCatalogo (INT, PRIMARY KEY, AUTO_INCREMENT)
-- vchNombreCatalogo (VARCHAR 255, NOT NULL) - Nombre del catálogo
-- vchCatalogo (VARCHAR 255, NOT NULL) - URL manual del PDF
-- vchFileId (VARCHAR 255, NULL) - ID de Drive (legacy, no se usa en nuevos registros)
-- imagenPortada (VARCHAR 255, NULL) - URL de Cloudinary para portada