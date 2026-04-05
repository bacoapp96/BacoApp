import pool from '../config/db.js';

// LISTAR
export const listarVentas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM venta');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// OBTENER
export const obtenerVenta = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM venta WHERE Id_venta = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Venta no encontrada"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREAR
export const crearVenta = async (req, res) => {
    try {
        const { Id_cliente, Id_usuario, Total } = req.body;

        if (!Id_cliente || !Id_usuario || !Total) {
            return res.status(400).json({
                error: "Faltan datos"
            });
        }

        const [result] = await pool.query(
            'INSERT INTO venta (Fecha, Id_cliente, Id_usuario, Total) VALUES (NOW(), ?, ?, ?)',
            [Id_cliente, Id_usuario, Total]
        );

        res.json({
            mensaje: "Venta creada",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACTUALIZAR
export const actualizarVenta = async (req, res) => {
    try {
        const { Id_cliente, Id_usuario, Total } = req.body;
        const id = req.params.id;

        const [result] = await pool.query(
            'UPDATE venta SET Id_cliente = ?, Id_usuario = ?, Total = ? WHERE Id_venta = ?',
            [Id_cliente, Id_usuario, Total, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Venta no encontrada"
            });
        }

        res.json({ mensaje: "Venta actualizada" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ELIMINAR
export const eliminarVenta = async (req, res) => {
    try {
        const id = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM venta WHERE Id_venta = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Venta no encontrada"
            });
        }

        res.json({ mensaje: "Venta eliminada" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};