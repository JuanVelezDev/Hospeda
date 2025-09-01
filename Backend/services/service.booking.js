import { Router } from "express";
import db from "../db.js";

const router = Router();

// Crear solicitud de reserva
router.post("/", async (req, res) => {
    const { user_id, apartment_id, start_date, end_date } = req.body;
    try {
        const requestResult = await db.query(
            `INSERT INTO booking_request (user_id, apartment_id, request_date, status)
       VALUES ($1,$2,NOW(),'pending') RETURNING request_id`,
            [user_id, apartment_id]
        );

        const request_id = requestResult.rows[0].request_id;

        const bookingResult = await db.query(
            `INSERT INTO booking (request_id, start_date, end_date, status)
       VALUES ($1,$2,$3,'active') RETURNING *`,
            [request_id, start_date, end_date]
        );

        res.json({ message: "Reserva creada en estado pending", booking: bookingResult.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error creando reserva" });
    }
});

// Aprobar solicitud
router.put("/:requestId/approve", async (req, res) => {
    const { requestId } = req.params;

    try {
        // Actualiza el estado de la solicitud a 'approved'
        const result = await db.query(
            `UPDATE booking_request 
       SET status = 'approved' 
       WHERE request_id = $1 
       RETURNING *`,
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Solicitud no encontrada" });
        }

        res.json({ message: "Solicitud aprobada correctamente", request: result.rows[0] });

    } catch (err) {
        console.error("Error en approve:", err);
        res.status(500).json({ error: "Error aprobando la solicitud" });
    }
});
// Rechazar solicitud
router.put("/:requestId/reject", async (req, res) => {
    const { requestId } = req.params;
    try {
        await db.query(
            `UPDATE booking_request SET status='rejected' WHERE request_id=$1 RETURNING *`,
            [requestId]
        );
        res.json({ message: "Solicitud rechazada correctamente" });
    } catch (err) {
        console.error("Error en reject:", err);
        res.status(500).json({ error: "Error rechazando la solicitud" });
    }
});


// Obtener solicitudes pendientes de las propiedades del propietario
router.get("/owner/:userId/pending", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query(`
      SELECT br.request_id, br.status AS request_status, br.request_date,
             b.booking_id, b.start_date, b.end_date, b.status AS booking_status,
             a.apartment_id, a.title, a.address,
             u.user_id, u.first_name || ' ' || u.last_name AS student_name,
             u.email AS student_email
      FROM booking_request br
      JOIN booking b ON br.request_id = b.request_id
      JOIN apartment a ON br.apartment_id = a.apartment_id
      JOIN users u ON br.user_id = u.user_id
      WHERE a.user_id = $1 AND br.status='pending'
      ORDER BY br.request_date DESC
    `, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error obteniendo reservas pendientes" });
    }
});


// Obtener todas las solicitudes del propietario
router.get("/owner/:userId/all", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query(`
      SELECT br.request_id, br.status AS request_status, br.request_date,
             b.booking_id, b.start_date, b.end_date, b.status AS booking_status,
             a.apartment_id, a.title, a.address,
             u.user_id, u.first_name || ' ' || u.last_name AS student_name,
             u.email AS student_email
      FROM booking_request br
      JOIN booking b ON br.request_id = b.request_id
      JOIN apartment a ON br.apartment_id = a.apartment_id
      JOIN users u ON br.user_id = u.user_id
      WHERE a.user_id = $1
      ORDER BY br.request_date DESC
    `, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error obteniendo reservas" });
    }
});


// Obtener todas las reservas de un estudiante
router.get("/student/:studentId", async (req, res) => {
    const { studentId } = req.params;

    try {
        const result = await db.query(`
      SELECT 
        br.request_id,
        br.status AS request_status,
        b.start_date,
        b.end_date,
        b.status AS booking_status,
        a.title,
        a.address,
        a.price,
        ap.photo_url
      FROM booking_request br
      LEFT JOIN booking b ON br.request_id = b.request_id
      LEFT JOIN apartment a ON br.apartment_id = a.apartment_id
      LEFT JOIN apartment_photo ap ON a.apartment_id = ap.apartment_id
      WHERE br.user_id = $1
      GROUP BY br.request_id, b.start_date, b.end_date, b.status, a.apartment_id, ap.photo_url
      ORDER BY br.request_date DESC
    `, [studentId]);

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching student bookings:", err);
        res.status(500).json({ error: "Error fetching student bookings" });
    }
});


export default router;
