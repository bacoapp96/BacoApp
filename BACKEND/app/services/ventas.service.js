import pool from "../config/db.js";

export const registrarVentaAprobada = async ({
    idCliente,
    idUsuario,
    productos
}) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        let totalReal = 0;
        const productosVenta = [];

        for (const item of productos) {

            const idProducto = Number(item.idProducto);
            const cantidad = Number(item.cantidad);

            const [rows] = await connection.query(
                `SELECT id, nombre, precio, stock
                 FROM productos
                 WHERE id = ?
                 FOR UPDATE`,
                [idProducto]
            );

            if (rows.length === 0) {
                throw new Error(`El producto ${idProducto} no existe.`);
            }

            const producto = rows[0];

            if (Number(producto.stock) < cantidad) {
                throw new Error(
                    `Stock insuficiente para ${producto.nombre}.`
                );
            }

            const precio = Number(producto.precio);
            const subtotal = precio * cantidad;

            totalReal += subtotal;

            productosVenta.push({
                idProducto,
                cantidad,
                precio
            });
        }

        // CREAR VENTA
        const [ventaResult] = await connection.query(
            `INSERT INTO venta
                (Fecha, Id_cliente, Id_usuario, Total)
             VALUES
                (NOW(), ?, ?, ?)`,
            [
                idCliente,
                idUsuario,
                totalReal
            ]
        );

        const idVenta = ventaResult.insertId;

        // DETALLE + STOCK
        for (const producto of productosVenta) {

            await connection.query(
                `INSERT INTO detalle_venta
                    (Id_venta, Id_producto, Cantidad, Precio)
                 VALUES
                    (?, ?, ?, ?)`,
                [
                    idVenta,
                    producto.idProducto,
                    producto.cantidad,
                    producto.precio
                ]
            );

            await connection.query(
                `UPDATE productos
                 SET stock = stock - ?
                 WHERE id = ?`,
                [
                    producto.cantidad,
                    producto.idProducto
                ]
            );
        }

        await connection.commit();

        return {
            id_venta: idVenta,
            total: totalReal
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};