import pool from "../config/db.js";

// ===============================
// LISTAR PROVEEDORES
// ===============================

export const listarProveedores = async (req, res) => {
    try {

        const [rows] = await pool.query(`
            SELECT *
            FROM proveedores
            ORDER BY id_proveedor DESC
        `);

        res.json(rows);

    } catch (error) {

        console.error("Error al listar proveedores:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


// ===============================
// OBTENER PROVEEDOR
// ===============================

export const obtenerProveedor = async (req, res) => {

    try {

        const [rows] = await pool.query(
            `
            SELECT *
            FROM proveedores
            WHERE id_proveedor = ?
            `,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Proveedor no encontrado"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error("Error al obtener proveedor:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


// ===============================
// CREAR PROVEEDOR
// ===============================

export const crearProveedor = async (req, res) => {

    try {

        const {
            nombre,
            telefono,
            correo,
            direccion,
            ciudad,
            nit,
            contacto,
            notas
        } = req.body;

        if (!nombre) {
            return res.status(400).json({
                error: "El nombre del proveedor es obligatorio"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO proveedores
            (
                nombre,
                telefono,
                correo,
                direccion,
                ciudad,
                nit,
                contacto,
                notas
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                nombre,
                telefono,
                correo,
                direccion,
                ciudad,
                nit,
                contacto,
                notas
            ]
        );

        res.status(201).json({
            mensaje: "Proveedor creado correctamente",
            id: result.insertId
        });

    } catch (error) {

        console.error("Error al crear proveedor:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


// ===============================
// ACTUALIZAR PROVEEDOR
// ===============================

export const actualizarProveedor = async (req, res) => {

    try {

        const {
            nombre,
            telefono,
            correo,
            direccion,
            ciudad,
            nit,
            contacto,
            notas
        } = req.body;

        const [result] = await pool.query(
            `
            UPDATE proveedores
            SET
                nombre = ?,
                telefono = ?,
                correo = ?,
                direccion = ?,
                ciudad = ?,
                nit = ?,
                contacto = ?,
                notas = ?
            WHERE id_proveedor = ?
            `,
            [
                nombre,
                telefono,
                correo,
                direccion,
                ciudad,
                nit,
                contacto,
                notas,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Proveedor no encontrado"
            });
        }

        res.json({
            mensaje: "Proveedor actualizado correctamente"
        });

    } catch (error) {

        console.error("Error al actualizar proveedor:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


// ===============================
// ELIMINAR PROVEEDOR
// ===============================

export const eliminarProveedor = async (req, res) => {

    try {

        const [result] = await pool.query(
            `
            DELETE FROM proveedores
            WHERE id_proveedor = ?
            `,
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Proveedor no encontrado"
            });
        }

        res.json({
            mensaje: "Proveedor eliminado correctamente"
        });

    } catch (error) {

        console.error("Error al eliminar proveedor:", error);

        res.status(500).json({
            error: error.message
        });
    }
};