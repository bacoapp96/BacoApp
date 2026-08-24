import session from "express-session";
import pool from "../config/db.js";

class MySQLSessionStore extends session.Store {

    async get(sid, callback) {
        try {
            const [rows] = await pool.query(
                `SELECT datos
                 FROM sesiones
                 WHERE id = ?
                 AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())
                 LIMIT 1`,
                [sid]
            );

            if (!rows.length) {
                return callback(null, null);
            }

            const datos = rows[0].datos;

            callback(
                null,
                typeof datos === "string"
                    ? JSON.parse(datos)
                    : datos
            );

        } catch (error) {
            console.error("Error obteniendo sesión:", error);
            callback(error);
        }
    }

    async set(sid, sessionData, callback) {
        try {
            const expiracion = sessionData.cookie?.expires
                ? new Date(sessionData.cookie.expires)
                : new Date(Date.now() + 24 * 60 * 60 * 1000);

            await pool.query(
                `INSERT INTO sesiones
                    (id, datos, fecha_creacion, fecha_expiracion)
                 VALUES (?, ?, NOW(), ?)
                 ON DUPLICATE KEY UPDATE
                    datos = VALUES(datos),
                    fecha_expiracion = VALUES(fecha_expiracion)`,
                [
                    sid,
                    JSON.stringify(sessionData),
                    expiracion
                ]
            );

            callback(null);

        } catch (error) {
            console.error("Error guardando sesión:", error);
            callback(error);
        }
    }

    async destroy(sid, callback) {
        try {
            await pool.query(
                `DELETE FROM sesiones WHERE id = ?`,
                [sid]
            );

            callback(null);

        } catch (error) {
            console.error("Error eliminando sesión:", error);
            callback(error);
        }
    }
}

export const sessionStore = new MySQLSessionStore();