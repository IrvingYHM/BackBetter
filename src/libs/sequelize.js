const { Sequelize } = require("sequelize");
const { config } = require("../config/config");
const setupModels = require("../db/models");

/* const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: "mysql",
  define: {
    timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta 
  }
}); */

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,//
  config.dbPassword,
  {
    host: config.dbHost,
    dialect: "mysql",
  }
);



// Configura los modelos
setupModels(sequelize);

// Sincroniza los modelos con la base de datos
sequelize.sync();

module.exports = sequelize;
