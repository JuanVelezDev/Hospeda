import express, { json } from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(json());

// Configuración de PostgreSQL con datos reales
const db = new Pool({
    host: 'aws-1-us-east-2.pooler.supabase.com',
    user: 'postgres.ejpxkahordytcdnfibdq',
    password: 'dp4a1tJPFVi8lXNY', // remplaza con tu contraseña de Supabase
    database: 'postgres',
    port: 6543,
    ssl: { rejectUnauthorized: false } // Supabase requiere SSL
});

// get apartment
app.get('/apartment', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM apartment');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});



// add apartment
app.post('/apartment', async (req, res) => {
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
app.put('/apartment/:id', async (req, res) => {
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
app.delete('/apartment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM apartment WHERE apartment_id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Apartamento no encontrado' });
        res.json({ message: 'Apartamento eliminado' });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));