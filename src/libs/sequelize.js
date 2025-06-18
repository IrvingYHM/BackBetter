const { Sequelize } = require("sequelize");
const { config } = require("../config/config");
const setupModels = require("../db/models");

/* const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: "mysql",
  define: {
    timestamps: false // Si la tabla no tiene campos de timestamp, puedes omitir esta 
  }
}); */

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: "mysql",
  define: {
    timestamps: false,
  },
});

// Configura los modelos
setupModels(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente");
    await sequelize.sync();
    console.log("Modelos sincronizados con la base de datos");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
})();

module.exports = sequelize;
