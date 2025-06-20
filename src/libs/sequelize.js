require("dotenv").config();
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
/* const { config } = require("../config/config"); */
const setupModels = require("../db/models");

// Crea la base de datos si no existe
async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
  );
  await connection.end();
}

console.log("Conectando a la BD con:");
console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
