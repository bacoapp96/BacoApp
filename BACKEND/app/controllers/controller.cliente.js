import pool from '../config/db.js';

// LISTAR CLIENTES
export const listarClientes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cliente');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// OBTENER CLIENTE
export const obtenerCliente = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM cliente WHERE Id_cliente = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREAR CLIENTE
export const crearCliente = async (req, res) => {
    try {
        const { Nombre, Telefono, Direccion } = req.body;

        if (!Nombre) {
            return res.status(400).json({
                error: "El nombre es obligatorio"
            });
        }

        const [result] = await pool.query(
            'INSERT INTO cliente (Nombre, Telefono, Direccion) VALUES (?, ?, ?)',
            [Nombre, Telefono, Direccion]
        );

        res.json({ id: result.insertId });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACTUALIZAR CLIENTE
export const actualizarCliente = async (req, res) => {
    try {
        const { Nombre, Telefono, Direccion } = req.body;
        const id = parseInt(req.params.id);

        const [result] = await pool.query(
            'UPDATE cliente SET Nombre = ?, Telefono = ?, Direccion = ? WHERE Id_cliente = ?',
            [Nombre, Telefono, Direccion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json({ mensaje: "Cliente actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ELIMINAR CLIENTE
export const eliminarCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const [result] = await pool.query(
            'DELETE FROM cliente WHERE Id_cliente = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.sendStatus(204);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};