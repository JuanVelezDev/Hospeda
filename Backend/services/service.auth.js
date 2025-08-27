import { Router } from "express";
import db from "../db.js";

const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, role, phone } = req.body;

    try {
        const exist = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (exist.rows.length > 0) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        await db.query(
            "INSERT INTO users (first_name,last_name,email,password,role,phone) VALUES ($1,$2,$3,$4,$5,$6)",
            [first_name, last_name, email, password, role, phone]
        );

        res.json({ message: "Usuario registrado exitosamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query(
            "SELECT * FROM users WHERE email=$1 AND password=$2",
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const user = result.rows[0];
        res.json({
            message: "Login exitoso",
            user: {
                id: user.user_id,
                email: user.email,
                role: user.role,
                name: `${user.first_name} ${user.last_name}`
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
