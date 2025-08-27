import { Router } from "express";
import db from "../db.js";

const router = Router();

// get apartment
router.get('/apartment', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM apartment');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});


// add apartment
router.post('/apartment', async (req, res) => {
    const { owner_id, title, description, address, city, price } = req.body;
    try {
        await db.query('INSERT INTO apartment (owner_id, title, description,address,city,price) VALUES ($1, $2,$3,$4,$5,$6)',
            [owner_id, title, description, address, city, price]);
        res.json({ message: 'Apartamento agregado' });
    } catch (err) {
        res.status(500).json(err);
    }
});


// Update apartment
router.put('/apartment/:id', async (req, res) => {
    const { id } = req.params;
    const { owner_id, title, description, address, city, price } = req.body;
    try {
        const result = await db.query(
            'UPDATE apartment SET owner_id = $1, title = $2, description = $3, address = $4, city = $5, price = $6 WHERE apartment_id = $7',
            [owner_id, title, description, address, city, price, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'Apartamento no encontrado' });
        res.json({ message: 'Apartamento actualizado' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Eliminar usuario
router.delete('/apartment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM apartment WHERE apartment_id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Apartamento no encontrado' });
        res.json({ message: 'Apartamento eliminado' });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
