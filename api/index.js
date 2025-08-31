const express = require("express");
const cors = require("cors");
const path = require("path");

// Importar servicios
const usersService = require("../Backend/services/service.users.js");
const apartmentService = require("../Backend/services/service.apartment.js");
const authService = require("../Backend/services/service.auth.js");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/api/test", (req, res) => {
    res.json({ 
        message: "Backend funcionando correctamente en Vercel", 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Rutas de la API
app.use("/api/users", usersService);
app.use("/api/apartment", apartmentService);
app.use("/api/auth", authService);

// Ruta catch-all para el frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

module.exports = app;
