import express from "express";
import cors from "cors";
import usersService from "./services/service.users.js";
import apartmentService from "./services/service.apartment.js";
import authService from "./services/service.auth.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de Hospeda funcionando correctamente" });
});

// Rutas
app.use("/users", usersService);
app.use("/apartment", apartmentService);
app.use("/auth", authService);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
