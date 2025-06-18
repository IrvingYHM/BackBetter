const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Catalogos extends Model {}

Catalogos.init(
  {
    IdCatalogo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    vchNombreCatalogo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vchCatalogo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "Catalogos",
    tableName: "tblCatalogos",
    timestamps: false, // Si la tabla no tiene campos de timestamp, puedes omitir esta línea
  }
);

module.exports = Catalogos;