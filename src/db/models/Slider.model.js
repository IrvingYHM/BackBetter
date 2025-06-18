const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

class Slider extends Model {}

Slider.init({
  IdSlider: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Imagen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UrlDestino: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Slider',
  tableName: 'tblslider',
  timestamps: false,
});

module.exports = Slider;
