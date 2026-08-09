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

export const obtenerDetalleVenta = async (req, res) => {
    try {
        
        const [rows] = await pool.query(
           `SELECT 
            p.nombre,
            Dv.Cantidad,
            dv.Precio,
            (dv.Cantidad * dv.Precio) AS subtotal
            FROM detalle_venta dv
            INNER JOIN productos p
            ON p.id = dv.Id_producto
            WHERE dv.Id_venta = ?`,
            [req.params.id]);

            res.json(rows);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
        
    }
};

// CREAR
// =========================
// CREAR VENTA COMPLETA
// =========================

export const crearVenta = async (req, res) => {

    const connection = await pool.getConnection();

    try {

        // Formato actual del checkout: { id_cliente, id_usuario, total, productos }.
        // Se aceptan las propiedades antiguas para mantener compatibilidad con
        // consumidores existentes del endpoint.
        const Id_cliente = req.body.id_cliente ?? req.body.Id_cliente;
        const Id_usuario = req.body.id_usuario ?? req.body.Id_usuario;
        const items = req.body.productos ?? req.body.items;

        // =========================
        // VALIDAR DATOS BÁSICOS
        // =========================

        if (!Id_cliente || !Id_usuario) {
            return res.status(400).json({
                error: "Falta el cliente o usuario."
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "El carrito está vacío."
            });
        }

        // =========================
        // INICIAR TRANSACCIÓN
        // =========================

        await connection.beginTransaction();

        let totalReal = 0;

        const productosVenta = [];

        // =========================
        // VALIDAR PRODUCTOS
        // =========================

        for (const item of items) {

            const idProducto = Number(item.idProducto ?? item.id_producto);
            const cantidad = Number(item.cantidad);

            if (!idProducto || !cantidad || cantidad <= 0) {

                throw new Error(
                    "Producto o cantidad inválida."
                );

            }

            // Bloqueamos el producto mientras se procesa la venta
            const [productos] = await connection.query(
                `
                SELECT
                    id,
                    nombre,
                    precio,
                    stock
                FROM productos
                WHERE id = ?
                FOR UPDATE
                `,
                [idProducto]
            );

            if (productos.length === 0) {

                throw new Error(
                    `El producto ${idProducto} no existe.`
                );

            }

            const producto = productos[0];

            // =========================
            // VALIDAR STOCK
            // =========================

            if (producto.stock < cantidad) {

                throw new Error(
                    `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}.`
                );

            }

            // El precio nunca se toma del cliente. Si hay una oferta vigente,
            // se calcula desde la oferta y el precio actual almacenados en BD.
            const [ofertasActivas] = await connection.query(
                `
                SELECT id_oferta, descuento
                FROM ofertas
                WHERE id_producto = ?
                  AND NOW() BETWEEN fecha_inicio AND fecha_fin
                  AND (hasta_agotar_existencias = 0 OR ? > 0)
                ORDER BY fecha_inicio DESC, id_oferta DESC
                LIMIT 1
                `,
                [idProducto, producto.stock]
            );

            const oferta = ofertasActivas[0];
            const precioNormal = Number(producto.precio);
            const descuento = oferta ? Number(oferta.descuento) : 0;
            const precio = Number(
                (precioNormal - (precioNormal * descuento / 100)).toFixed(2)
            );

            const subtotal = precio * cantidad;

            totalReal += subtotal;

            productosVenta.push({
                idProducto,
                nombre: producto.nombre,
                cantidad,
                precioNormal,
                descuento,
                precio,
                subtotal,
                idOferta: oferta?.id_oferta ?? null
            });
        }

        // =========================
        // CREAR VENTA
        // =========================

        const [ventaResult] = await connection.query(
            `
            INSERT INTO venta
            (
                Fecha,
                Id_cliente,
                Id_usuario,
                Total
            )
            VALUES
            (
                NOW(),
                ?,
                ?,
                ?
            )
            `,
            [
                Id_cliente,
                Id_usuario,
                totalReal
            ]
        );

        const idVenta = ventaResult.insertId;

        // =========================
        // CREAR DETALLES
        // =========================

        for (const producto of productosVenta) {

            await connection.query(
                `
                INSERT INTO detalle_venta
                (
                    Id_venta,
                    Id_producto,
                    Cantidad,
                    Precio
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,
                [
                    idVenta,
                    producto.idProducto,
                    producto.cantidad,
                    producto.precio
                ]
            );

            // =========================
            // DESCONTAR INVENTARIO
            // =========================

            await connection.query(
                `
                UPDATE productos
                SET stock = stock - ?
                WHERE id = ?
                `,
                [
                    producto.cantidad,
                    producto.idProducto
                ]
            );
        }

        // =========================
        // CONFIRMAR
        // =========================

        await connection.commit();

        res.status(201).json({

            ok: true,

            mensaje: "Venta creada correctamente.",

            venta: {
                id_venta: idVenta,
                id_cliente: Id_cliente,
                id_usuario: Id_usuario,
                total: totalReal
            },

            productos: productosVenta

        });

    } catch (error) {

        // =========================
        // DESHACER TODO
        // =========================

        await connection.rollback();

        console.error(
            "ERROR CREANDO VENTA:",
            error
        );

        res.status(400).json({
            ok: false,
            error: error.message
        });

    } finally {

        connection.release();

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

export const obtenerVentasCliente = async (req, res) => {
    try {
        
        const [ rows ] = await pool.query(
          `SELECT 
          Id_venta,
          Fecha,
          Total
          FROM venta
          WHERE Id_cliente = ?
          ORDER BY Fecha DESC`,
          [req.params.id]
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
        
    }
};

// VENTAS DEL MES ACTUAL
export const obtenerVentasMes = async (req, res) => {
    try {

        const [rows] = await pool.query(`
            SELECT 
                COALESCE(SUM(Total), 0) AS totalVentas,
                COUNT(*) AS cantidadVentas
            FROM venta
            WHERE MONTH(Fecha) = MONTH(CURDATE())
            AND YEAR(Fecha) = YEAR(CURDATE())
        `);

        res.json({
            totalVentas: Number(rows[0].totalVentas),
            cantidadVentas: Number(rows[0].cantidadVentas)
        });

    } catch (error) {

        console.error("Error obteniendo ventas del mes:", error);

        res.status(500).json({
            error: error.message
        });

    }
};

// PRODUCTOS VENDIDOS EN EL MES ACTUAL
export const obtenerProductosVendidosMes = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT
                COALESCE(SUM(dv.Cantidad), 0) AS productosVendidos
            FROM detalle_venta dv

            INNER JOIN venta v
                ON v.Id_venta = dv.Id_venta

            WHERE MONTH(v.Fecha) = MONTH(CURDATE())
            AND YEAR(v.Fecha) = YEAR(CURDATE())
        `);

        res.json({
            productosVendidos: Number(
                rows[0].productosVendidos
            )
        });

    } catch (error) {

        console.error(
            "Error obteniendo productos vendidos:",
            error
        );

        res.status(500).json({
            error: error.message
        });

    }

};

// PRODUCTO TOP DEL MES
export const obtenerProductoTopMes = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT
                p.id,
                p.nombre,
                SUM(dv.Cantidad) AS unidadesVendidas
            FROM detalle_venta dv

            INNER JOIN venta v
                ON v.Id_venta = dv.Id_venta

            INNER JOIN productos p
                ON p.id = dv.Id_producto

            WHERE MONTH(v.Fecha) = MONTH(CURDATE())
            AND YEAR(v.Fecha) = YEAR(CURDATE())

            GROUP BY p.id, p.nombre

            ORDER BY unidadesVendidas DESC

            LIMIT 1
        `);

        if (rows.length === 0) {

            return res.json({
                hayProducto: false,
                producto: null
            });

        }

        res.json({
            hayProducto: true,
            producto: {
                id: rows[0].id,
                nombre: rows[0].nombre,
                unidadesVendidas: Number(
                    rows[0].unidadesVendidas
                )
            }
        });

    } catch (error) {

        console.error(
            "Error obteniendo producto top:",
            error
        );

        res.status(500).json({
            error: error.message
        });

    }

};

// =========================
// MEJOR VENDEDOR DEL MES
// =========================

export const obtenerMejorVendedorMes = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT
                u.Id_usuario,
                u.Nombre,
                COUNT(v.Id_venta) AS cantidadVentas,
                COALESCE(SUM(v.Total), 0) AS totalVendido

            FROM venta v

            INNER JOIN usuario u
                ON u.Id_usuario = v.Id_usuario

            WHERE MONTH(v.Fecha) = MONTH(CURDATE())
            AND YEAR(v.Fecha) = YEAR(CURDATE())

            GROUP BY
                u.Id_usuario,
                u.Nombre

            ORDER BY
                cantidadVentas DESC,
                totalVendido DESC

            LIMIT 1
        `);


        if (rows.length === 0) {

            return res.json({
                hayVendedor: false,
                vendedor: null
            });

        }


        res.json({

            hayVendedor: true,

            vendedor: {

                id: rows[0].Id_usuario,

                nombre: rows[0].Nombre,

                cantidadVentas:
                    Number(rows[0].cantidadVentas),

                totalVendido:
                    Number(rows[0].totalVendido)

            }

        });


    } catch (error) {

        console.error(
            "Error obteniendo mejor vendedor:",
            error
        );

        res.status(500).json({
            error: error.message
        });

    }

};

export const obtenerProductoTopSemanal = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT
                p.id,
                p.nombre,
                SUM(dv.Cantidad) AS unidadesVendidas

            FROM detalle_venta dv

            INNER JOIN venta v
                ON v.Id_venta = dv.Id_venta

            INNER JOIN productos p
                ON p.id = dv.Id_producto

            WHERE v.Fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)

            GROUP BY
                p.id,
                p.nombre

            ORDER BY
                unidadesVendidas DESC

            LIMIT 1
        `);

        if (rows.length === 0) {

            return res.json({
                hayProducto: false,
                producto: null
            });

        }

        res.json({

            hayProducto: true,

            producto: {

                id: rows[0].id,

                nombre: rows[0].nombre,

                unidadesVendidas:
                    Number(rows[0].unidadesVendidas)

            }

        });

    } catch (error) {

        console.error(
            "Error obteniendo producto top semanal:",
            error
        );

        res.status(500).json({
            error: error.message
        });

    }

};

// =========================
// VENTAS DE LA SEMANA
// =========================

export const obtenerVentasSemanales = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT
                WEEKDAY(Fecha) AS dia,
                COALESCE(SUM(Total), 0) AS total
            FROM venta
            WHERE Fecha >= DATE_SUB(
                CURDATE(),
                INTERVAL WEEKDAY(CURDATE()) DAY
            )
            AND Fecha < DATE_ADD(
                DATE_SUB(
                    CURDATE(),
                    INTERVAL WEEKDAY(CURDATE()) DAY
                ),
                INTERVAL 7 DAY
            )
            GROUP BY WEEKDAY(Fecha)
            ORDER BY dia
        `);

        res.json({
            ventas: rows.map(row => ({
                dia: Number(row.dia),
                total: Number(row.total)
            }))
        });

    } catch (error) {

        console.error(
            "Error obteniendo ventas semanales:",
            error
        );

        res.status(500).json({
            error: error.message
        });

    }

};

// =========================
// ÚLTIMAS VENTAS
// =========================

export const obtenerUltimasVentas = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT
                v.Id_venta,
                v.Fecha,
                v.Total,
                p.nombre AS producto,
                u.Nombre AS cliente

            FROM venta v

            INNER JOIN clientes c
                ON c.id = v.Id_cliente

            INNER JOIN usuario u
                ON u.Id_usuario = c.Id_usuario

            INNER JOIN detalle_venta d
                ON d.Id_venta = v.Id_venta

            INNER JOIN productos p
                ON p.id = d.Id_producto

            ORDER BY v.Fecha DESC

            LIMIT 5
        `);

        res.json(rows);

    } catch (error) {

        console.error(
            "Error obteniendo últimas ventas:",
            error
        );

        res.status(500).json({
            error: error.message
        });

    }

};
