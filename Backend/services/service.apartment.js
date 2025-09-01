import { Router } from "express";
import db from "../db.js";
import upload from "../Middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const router = Router();

// GET apartments
router.get("/", async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM apartment");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET apartment by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query("SELECT * FROM apartment WHERE apartment_id = $1", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Apartamento no encontrado" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error obteniendo apartamento" });
    }
});

// GET fotos de un apartamento
router.get("/:apartment_id/photos", async (req, res) => {
    const { apartment_id } = req.params;
    try {
        const result = await db.query(
            "SELECT photo_id, apartment_id, photo_url, description FROM apartment_photo WHERE apartment_id = $1",
            [apartment_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error obteniendo las fotos" });
    }
});

// ADD apartment
router.post("/", async (req, res) => {
    const { user_id, title, description, address, city, price } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO apartment (user_id, title, description, address, city, price) VALUES ($1,$2,$3,$4,$5,$6) RETURNING apartment_id',
            [user_id, title, description, address, city, price]
        );
        res.json({ apartment_id: result.rows[0].apartment_id });
    } catch (err) {
        res.status(500).json({ error: "Error creando apartamento" });
    }
});

// UPLOAD apartment photo
router.post("/:apartment_id/photo", upload.single("photo"), async (req, res) => {
    const { apartment_id } = req.params;
    const { description } = req.body;

    if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

    try {
        const uploadFromBuffer = (fileBuffer) =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "apartments" },
                    (error, result) => (result ? resolve(result) : reject(error))
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });

        const result = await uploadFromBuffer(req.file.buffer);
        const photo_url = result.secure_url;

        const dbResult = await db.query(
            "INSERT INTO apartment_photo (apartment_id, photo_url, description) VALUES ($1,$2,$3) RETURNING *",
            [apartment_id, photo_url, description]
        );

        res.json({ photo: dbResult.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error subiendo la foto" });
    }
});

// UPDATE apartment
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { user_id, title, description, address, city, price } = req.body;
    try {
        const result = await db.query(
            'UPDATE apartment SET user_id=$1, title=$2, description=$3, address=$4, city=$5, price=$6 WHERE apartment_id=$7',
            [user_id, title, description, address, city, price, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'Apartamento no encontrado' });
        res.json({ message: 'Apartamento actualizado' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE apartment
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM apartment WHERE apartment_id=$1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Apartamento no encontrado' });
        res.json({ message: 'Apartamento eliminado' });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
