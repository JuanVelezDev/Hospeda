const express = require("express");
const cors = require("cors");
const usersService = require("./services/service.users.js");
const apartmentService = require("./services/service.apartment.js");
const authService = require("./services/service.auth.js");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/users", usersService);
app.use("/apartment", apartmentService);
app.use("/auth", authService);

// Iniciar servidor solo si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
}

module.exports = app;
