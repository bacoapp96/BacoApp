import pool from '../config/db.js';

// LISTAR
export const listarInventario = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventario');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// OBTENER
export const obtenerInventario = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM inventario WHERE Id_inventario = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Inventario no encontrado"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREAR
export const crearInventario = async (req, res) => {
    try {
        const { Id_producto, Stock } = req.body;

        if (!Id_producto || Stock == null) {
            return res.status(400).json({
                error: "Faltan datos"
            });
        }

        const [result] = await pool.query(
            'INSERT INTO inventario (Id_producto, Stock) VALUES (?, ?)',
            [Id_producto, Stock]
        );

        res.json({
            mensaje: "Inventario creado",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACTUALIZAR
export const actualizarInventario = async (req, res) => {
    try {
        const { Id_producto, Stock } = req.body;
        const id = req.params.id;

        const [result] = await pool.query(
            'UPDATE inventario SET Id_producto = ?, Stock = ? WHERE Id_inventario = ?',
            [Id_producto, Stock, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Inventario no encontrado"
            });
        }

        res.json({ mensaje: "Inventario actualizado" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ELIMINAR
export const eliminarInventario = async (req, res) => {
    try {
        const id = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM inventario WHERE Id_inventario = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Inventario no encontrado"
            });
        }

        res.json({ mensaje: "Inventario eliminado" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};