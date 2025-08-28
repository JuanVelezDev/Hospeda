import express from "express";
import cors from "cors";
import usersService from "./services/service.users.js";
import apartmentService from "./services/service.apartment.js";
import authService from "./services/service.auth.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/users", usersService);
app.use("/apartment", apartmentService);
app.use("/auth", authService);

// Iniciar servidor
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
