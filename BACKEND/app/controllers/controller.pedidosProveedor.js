import pool from "../config/db.js";

// LISTAR PEDIDOS
export const listarPedidosProveedor = async (req, res) => {
    try {
        const [pedidos] = await pool.query(`
            SELECT
                pp.id_pedido,
                pp.id_proveedor,
                p.nombre AS proveedor,
                pp.fecha_pedido,
                pp.estado,
                pp.total,
                pp.observaciones
            FROM pedidos_proveedor pp
            INNER JOIN proveedores p
                ON p.id_proveedor = pp.id_proveedor
            ORDER BY pp.fecha_pedido DESC
        `);

        res.json(pedidos);

    } catch (error) {
        console.error("Error listando pedidos de proveedor:", error);

        res.status(500).json({
            ok: false,
            message: "Error al listar pedidos de proveedor"
        });
    }
};


// OBTENER UN PEDIDO CON SUS PRODUCTOS
export const obtenerPedidoProveedor = async (req, res) => {
    const { id } = req.params;

    try {
        const [pedidos] = await pool.query(`
            SELECT
                pp.id_pedido,
                pp.id_proveedor,
                p.nombre AS proveedor,
                p.correo,
                p.telefono,
                pp.fecha_pedido,
                pp.estado,
                pp.total,
                pp.observaciones
            FROM pedidos_proveedor pp
            INNER JOIN proveedores p
                ON p.id_proveedor = pp.id_proveedor
            WHERE pp.id_pedido = ?
        `, [id]);

        if (pedidos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: "Pedido no encontrado"
            });
        }

        const [detalles] = await pool.query(`
            SELECT
                d.id_detalle,
                d.id_producto,
                pr.nombre AS producto,
                d.cantidad,
                d.precio,
                d.subtotal
            FROM detalle_pedido_proveedor d
            INNER JOIN productos pr
                ON pr.id = d.id_producto
            WHERE d.id_pedido = ?
        `, [id]);

        res.json({
            ok: true,
            pedido: pedidos[0],
            productos: detalles
        });

    } catch (error) {
        console.error("Error obteniendo pedido:", error);

        res.status(500).json({
            ok: false,
            message: "Error al obtener el pedido"
        });
    }
};


// CREAR PEDIDO
export const crearPedidoProveedor = async (req, res) => {
    const {
        id_proveedor,
        productos,
        observaciones
    } = req.body;

    if (!id_proveedor) {
        return res.status(400).json({
            ok: false,
            message: "El proveedor es obligatorio"
        });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
            ok: false,
            message: "El pedido debe contener al menos un producto"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Verificar proveedor
        const [proveedor] = await connection.query(
            `SELECT id_proveedor, nombre, correo
             FROM proveedores
             WHERE id_proveedor = ?`,
            [id_proveedor]
        );

        if (proveedor.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                ok: false,
                message: "Proveedor no encontrado"
            });
        }

        let total = 0;
        const detalles = [];

        // Verificar productos y calcular total
        for (const item of productos) {

            const id_producto = Number(item.id_producto);
            const cantidad = Number(item.cantidad);

            if (!id_producto || !Number.isInteger(cantidad) || cantidad <= 0) {
                await connection.rollback();

                return res.status(400).json({
                    ok: false,
                    message: "Producto o cantidad inválida"
                });
            }

            const [producto] = await connection.query(
                `SELECT id, nombre, precio
                 FROM productos
                 WHERE id = ?`,
                [id_producto]
            );

            if (producto.length === 0) {
                await connection.rollback();

                return res.status(404).json({
                    ok: false,
                    message: `El producto ${id_producto} no existe`
                });
            }

            const precio = Number(producto[0].precio);
            const subtotal = precio * cantidad;

            total += subtotal;

            detalles.push({
                id_producto,
                cantidad,
                precio,
                subtotal
            });
        }

        // Crear pedido
        const [pedido] = await connection.query(
            `INSERT INTO pedidos_proveedor
                (id_proveedor, estado, total, observaciones)
             VALUES (?, 'Pendiente', ?, ?)`,
            [
                id_proveedor,
                total,
                observaciones || null
            ]
        );

        const id_pedido = pedido.insertId;

        // Crear detalles
        for (const detalle of detalles) {

            await connection.query(
                `INSERT INTO detalle_pedido_proveedor
                    (id_pedido, id_producto, cantidad, precio, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    id_pedido,
                    detalle.id_producto,
                    detalle.cantidad,
                    detalle.precio,
                    detalle.subtotal
                ]
            );
        }

        await connection.commit();

        res.status(201).json({
            ok: true,
            message: "Pedido creado correctamente",
            id_pedido,
            total
        });

    } catch (error) {

        await connection.rollback();

        console.error("Error creando pedido:", error);

        res.status(500).json({
            ok: false,
            message: "Error al crear pedido",
            error: error.message
        });

    } finally {
        connection.release();
    }
};


// CANCELAR PEDIDO
export const cancelarPedidoProveedor = async (req, res) => {
    const { id } = req.params;

    try {

        const [pedido] = await pool.query(
            `SELECT id_pedido, estado
             FROM pedidos_proveedor
             WHERE id_pedido = ?`,
            [id]
        );

        if (pedido.length === 0) {
            return res.status(404).json({
                ok: false,
                message: "Pedido no encontrado"
            });
        }

        if (pedido[0].estado === "Cancelado") {
            return res.status(400).json({
                ok: false,
                message: "El pedido ya está cancelado"
            });
        }

        if (pedido[0].estado === "Recibido") {
            return res.status(400).json({
                ok: false,
                message: "No se puede cancelar un pedido recibido"
            });
        }

        await pool.query(
            `UPDATE pedidos_proveedor
             SET estado = 'Cancelado'
             WHERE id_pedido = ?`,
            [id]
        );

        res.json({
            ok: true,
            message: "Pedido cancelado correctamente"
        });

    } catch (error) {

        console.error("Error cancelando pedido:", error);

        res.status(500).json({
            ok: false,
            message: "Error al cancelar pedido"
        });
    }
};