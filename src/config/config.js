require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: Number(process.env.DB_PORT), // aseguramos que sea número
  dbUrl: process.env.MYSQL_URL, // Usar la URL proporcionada por Railway
};

module.exports = { config };
