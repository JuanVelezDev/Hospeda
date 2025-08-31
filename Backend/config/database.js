const { Pool } = require("pg");

// Configuración de la base de datos con variables de entorno
const dbConfig = {
    host: process.env.DB_HOST || "aws-1-us-east-2.pooler.supabase.com",
    user: process.env.DB_USER || "postgres.ejpxkahordytcdnfibdq",
    password: process.env.DB_PASSWORD || "dp4a1tJPFVi8lXNY",
    database: process.env.DB_NAME || "postgres",
    port: process.env.DB_PORT || 6543,
    ssl: { rejectUnauthorized: false }
};

const db = new Pool(dbConfig);

module.exports = db;
