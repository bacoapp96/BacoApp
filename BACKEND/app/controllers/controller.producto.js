import pool from '../config/db.js';

// BUSCAR
export const buscarProductos = async (req, res) => {

    const { q } = req.query;

    let sql = "SELECT * FROM producto";
    let params = [];

    if (q) {
        sql = "SELECT * FROM producto WHERE Nombre LIKE ?";
        params = [`%${q}%`];
    }

    const [productos] = await pool.query(sql, params);

    res.json(productos);
};

// LISTAR
export const listarProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM producto');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// OBTENER
export const obtenerProducto = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM producto WHERE Id_producto = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREAR
export const crearProducto = async (req, res) => {
    try {
        const { Nombre, Precio } = req.body;

        if (!Nombre || !Precio) {
            return res.status(400).json({
                error: "Faltan campos Nombre o Precio"
            });
        }

        const [result] = await pool.query(
            'INSERT INTO producto (Nombre, Precio) VALUES (?, ?)',
            [Nombre, Precio]
        );

        res.json({
            mensaje: "Producto creado",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACTUALIZAR 
export const actualizarProducto = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("ID:", req.params.id);

        // Validar body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "No se enviaron datos en el body"
            });
        }

        // 
        const { Nombre, Precio } = req.body;

        if (!Nombre || !Precio) {
            return res.status(400).json({
                error: "Faltan campos Nombre o Precio"
            });
        }

        const [result] = await pool.query(
            'UPDATE producto SET Nombre = ?, Precio = ? WHERE Id_producto = ?',
            [Nombre, Precio, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// ELIMINAR
export const eliminarProducto = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM producto WHERE Id_producto = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};