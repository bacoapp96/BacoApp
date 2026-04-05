import pool from '../config/db.js';

// LISTAR  
export const listarDetallesVenta = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM detalle_venta');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
};

// OBTENER
export const obtenerDetallesVenta = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM detalle_venta WHERE id_detalle = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Detalle no encontrado"
            });
        }   

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }      
};

// CREAR
export const crearDetallesVenta = async (req, res) => {
    try {
        const { id_venta, id_producto, cantidad, precio } = req.body;

        if (!id_venta || !id_producto || !cantidad || !precio) {
            return res.status(400).json({
                error: "Faltan datos"
            });
        }   

        const [result] = await pool.query(
            'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)',
            [id_venta, id_producto, cantidad, precio]
        );      

        res.json({
            mensaje: "Detalle creado",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACTUALIZAR   
export const actualizarDetallesVenta = async (req, res) => {
    try {
        const { id_venta, id_producto, cantidad, precio } = req.body;
        const id = parseInt(req.params.id); 

        const [result] = await pool.query(
            'UPDATE detalle_venta SET id_venta = ?, id_producto = ?, cantidad = ?, precio = ? WHERE id_detalle = ?',
            [id_venta, id_producto, cantidad, precio, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({   
                error: "Detalle no encontrado"
            });
        }

        res.json({ mensaje: "Detalle actualizado" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};

// ELIMINAR 
export const eliminarDetallesVenta = async (req, res) => {
    try {
        const id = parseInt(req.params.id); 

        const [result] = await pool.query(
            'DELETE FROM detalle_venta WHERE id_detalle = ?',
            [id]    
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Detalle no encontrado"
            });
        }

        res.json({ mensaje: "Detalle eliminado" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};