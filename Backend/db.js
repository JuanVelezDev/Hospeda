const { Pool } = require("pg");

const db = new Pool({
    host: "aws-1-us-east-2.pooler.supabase.com",
    user: "postgres.ejpxkahordytcdnfibdq",
    password: "dp4a1tJPFVi8lXNY",
    database: "postgres",
    port: 6543,
    ssl: { rejectUnauthorized: false } 
});

module.exports = db;
