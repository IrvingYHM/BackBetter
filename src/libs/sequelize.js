const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const { config } = require("../config/config");
const setupModels = require("../db/models");

console.log("Iniciando aplicación...");

// Crea la base de datos si no existe
async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQLDATABASE}\`;`
  );
  await connection.end();
}

console.log({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
});

// Conexión Sequelize
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
    await ensureDatabaseExists(); // Aquí llamas la función antes de conectar
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente");
    await sequelize.sync();
    console.log("Modelos sincronizados con la base de datos");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
})();

module.exports = sequelize;
