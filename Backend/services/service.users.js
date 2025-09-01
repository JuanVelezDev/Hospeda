import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET users
router.get("/", async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM users");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT user_id, first_name || ' ' || last_name AS name, email, role FROM users WHERE user_id=$1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST user
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, role, phone } = req.body;
    try {
        await db.query(
            "INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5, $6)",
            [first_name, last_name, email, password, role, phone]
        );
        res.json({ message: "Usuario agregado" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// PUT user
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, password, role, phone } = req.body;
    try {
        const result = await db.query(
            "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, role = $5, phone = $6 WHERE user_id = $7",
            [first_name, last_name, email, password, role, phone, id]
        );
        if (result.rowCount === 0)
            return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario actualizado" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE user
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM users WHERE user_id = $1", [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado" });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
