import express from "express";
import pool from "../config/db.js";

const router = express.Router();

const verificarFrontend = (req, res, next) => {

    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : "";

    const secret =
        process.env.BACKEND_SECRET_KEY ||
        "clave_firma_seguridad_bacoapp";

    if (token !== secret) {
        return res.status(401).json({
            ok: false,
            message: "No autorizado"
        });
    }

    next();
};


// OBTENER SESIÓN
router.get("/", verificarFrontend, async (req, res) => {

    try {

        const sessionId = req.headers["x-session-id"];

        if (!sessionId) {
            return res.status(401).json({
                ok: false,
                message: "Sesión no encontrada"
            });
        }

        const [rows] = await pool.query(
            `SELECT datos
             FROM sesiones
             WHERE id = ?
             AND (
                 fecha_expiracion IS NULL
                 OR fecha_expiracion > NOW()
             )
             LIMIT 1`,
            [sessionId]
        );

        if (!rows.length) {
            return res.status(401).json({
                ok: false,
                message: "Sesión no activa"
            });
        }

        const datos =
            typeof rows[0].datos === "string"
                ? JSON.parse(rows[0].datos)
                : rows[0].datos;

        return res.json({
            ok: true,
            session: datos
        });

    } catch (error) {

        console.error("Error obteniendo sesión:", error);

        return res.status(500).json({
            ok: false,
            message: "Error obteniendo sesión"
        });
    }
});


// GUARDAR SESIÓN
router.post("/", verificarFrontend, async (req, res) => {

    try {

        const sessionId = req.headers["x-session-id"];
        const sessionData = req.body.session;

        if (!sessionId || !sessionData) {
            return res.status(400).json({
                ok: false,
                message: "Datos de sesión incompletos"
            });
        }

        await pool.query(
            `INSERT INTO sesiones
                (id, datos, fecha_creacion, fecha_expiracion)
             VALUES
                (?, ?, NOW(), ?)
             ON DUPLICATE KEY UPDATE
                datos = VALUES(datos),
                fecha_expiracion = VALUES(fecha_expiracion)`,
            [
                sessionId,
                JSON.stringify(sessionData),
                new Date(Date.now() + 24 * 60 * 60 * 1000)
            ]
        );

        return res.json({
            ok: true
        });

    } catch (error) {

        console.error("Error guardando sesión:", error);

        return res.status(500).json({
            ok: false,
            message: "Error guardando sesión"
        });
    }
});


// ELIMINAR SESIÓN
router.delete("/", verificarFrontend, async (req, res) => {

    try {

        const sessionId = req.headers["x-session-id"];

        if (sessionId) {
            await pool.query(
                `DELETE FROM sesiones WHERE id = ?`,
                [sessionId]
            );
        }

        return res.json({
            ok: true
        });

    } catch (error) {

        console.error("Error eliminando sesión:", error);

        return res.status(500).json({
            ok: false,
            message: "Error eliminando sesión"
        });
    }
});

export default router;