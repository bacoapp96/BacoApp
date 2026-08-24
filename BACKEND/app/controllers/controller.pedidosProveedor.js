import pool from "../config/db.js";
import brevo from "../config/brevo.js";

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
                nombre: producto[0].nombre,
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


// ==========================================
// ENVIAR CORREO AL PROVEEDOR
// ==========================================

try {

    const productosCorreo = detalles.map(detalle => {

    return `
        <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;">
                ${detalle.nombre}
            </td>

            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">
                ${detalle.cantidad}
            </td>

            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">
                $${Number(detalle.precio).toLocaleString("es-CO")}
            </td>

            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">
                $${Number(detalle.subtotal).toLocaleString("es-CO")}
            </td>
        </tr>
    `;

}).join("");


    await brevo.transactionalEmails.sendTransacEmail({

        sender: {
            name: "BacoApp",
            email: "bacoapp96@gmail.com"
        },

        to: [
            {
                email: proveedor[0].correo,
                name: proveedor[0].nombre
            }
        ],

        subject: `Nuevo pedido de BacoApp #${id_pedido}`,

        htmlContent: `
            <div style="
                font-family:Arial,sans-serif;
                max-width:700px;
                margin:auto;
                padding:20px;
            ">

                <h2 style="color:#6b21a8;">
                    📦 Nuevo pedido de BacoApp
                </h2>

                <p>
                    Hola <strong>${proveedor[0].nombre}</strong>,
                </p>

                <p>
                    Hemos generado un nuevo pedido a través de BacoApp.
                </p>

                <p>
                    <strong>Pedido:</strong> #${id_pedido}<br>
                    <strong>Estado:</strong> Pendiente
                </p>

                <h3>Productos solicitados</h3>

                <table style="
                    width:100%;
                    border-collapse:collapse;
                ">

                    <thead>

                        <tr style="background:#f3f3f3;">

                            <th style="padding:8px;text-align:left;">
                                Producto
                            </th>

                            <th style="padding:8px;">
                                Cantidad
                            </th>

                            <th style="padding:8px;text-align:right;">
                                Precio
                            </th>

                            <th style="padding:8px;text-align:right;">
                                Subtotal
                            </th>

                        </tr>

                    </thead>

                    <tbody>
                        ${productosCorreo}
                    </tbody>

                </table>

                <h3 style="text-align:right;">
                    Total:
                    $${Number(total).toLocaleString("es-CO")}
                </h3>

                ${
                    observaciones
                        ? `
                            <p>
                                <strong>Observaciones:</strong><br>
                                ${observaciones}
                            </p>
                        `
                        : ""
                }

                <p>
                    Por favor revise este pedido y gestione su entrega.
                </p>

                <hr>

                <p style="color:#777;font-size:13px;">
                    Este correo fue enviado automáticamente por BacoApp.
                </p>

            </div>
        `
    });

    console.log(
        `Correo de pedido #${id_pedido} enviado a ${proveedor[0].correo}`
    );

} catch (error) {

    console.error(
        `El pedido #${id_pedido} fue creado, pero no se pudo enviar el correo:`,
        error
    );

}


// ==========================================
// RESPUESTA
// ==========================================

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
// CANCELAR PEDIDO
export const cancelarPedidoProveedor = async (req, res) => {
    const { id } = req.params;

    try {

        // ==========================================
        // OBTENER PEDIDO Y PROVEEDOR
        // ==========================================

        const [pedido] = await pool.query(
            `SELECT
                pp.id_pedido,
                pp.id_proveedor,
                pp.fecha_pedido,
                pp.estado,
                pp.total,
                pp.observaciones,
                p.nombre AS proveedor,
                p.correo
             FROM pedidos_proveedor pp
             INNER JOIN proveedores p
                ON p.id_proveedor = pp.id_proveedor
             WHERE pp.id_pedido = ?`,
            [id]
        );

        if (pedido.length === 0) {
            return res.status(404).json({
                ok: false,
                message: "Pedido no encontrado"
            });
        }

        const pedidoActual = pedido[0];

        // ==========================================
        // VALIDAR ESTADO
        // ==========================================

        if (pedidoActual.estado === "Cancelado") {
            return res.status(400).json({
                ok: false,
                message: "El pedido ya está cancelado"
            });
        }

        if (pedidoActual.estado === "Recibido") {
            return res.status(400).json({
                ok: false,
                message: "No se puede cancelar un pedido recibido"
            });
        }

        // ==========================================
        // OBTENER PRODUCTOS DEL PEDIDO
        // ==========================================

        const [detalles] = await pool.query(
            `SELECT
                d.id_producto,
                pr.nombre AS producto,
                d.cantidad,
                d.precio,
                d.subtotal
             FROM detalle_pedido_proveedor d
             INNER JOIN productos pr
                ON pr.id = d.id_producto
             WHERE d.id_pedido = ?`,
            [id]
        );

        // ==========================================
        // CANCELAR PEDIDO
        // ==========================================

        await pool.query(
            `UPDATE pedidos_proveedor
             SET estado = 'Cancelado'
             WHERE id_pedido = ?`,
            [id]
        );

        // ==========================================
        // ENVIAR CORREO AL PROVEEDOR
        // ==========================================

        try {

            const productosCorreo = detalles.map(detalle => `
                <tr>
                    <td style="padding:8px;border-bottom:1px solid #ddd;">
                        ${detalle.producto}
                    </td>

                    <td style="
                        padding:8px;
                        border-bottom:1px solid #ddd;
                        text-align:center;
                    ">
                        ${detalle.cantidad}
                    </td>

                    <td style="
                        padding:8px;
                        border-bottom:1px solid #ddd;
                        text-align:right;
                    ">
                        $${Number(detalle.precio).toLocaleString("es-CO")}
                    </td>

                    <td style="
                        padding:8px;
                        border-bottom:1px solid #ddd;
                        text-align:right;
                    ">
                        $${Number(detalle.subtotal).toLocaleString("es-CO")}
                    </td>
                </tr>
            `).join("");

            await brevo.transactionalEmails.sendTransacEmail({

                sender: {
                    name: "BacoApp",
                    email: "bacoapp96@gmail.com"
                },

                to: [
                    {
                        email: pedidoActual.correo,
                        name: pedidoActual.proveedor
                    }
                ],

                subject: `Pedido #${pedidoActual.id_pedido} cancelado - BacoApp`,

                htmlContent: `
                    <div style="
                        font-family:Arial,sans-serif;
                        max-width:700px;
                        margin:auto;
                        padding:20px;
                    ">

                        <h2 style="color:#dc2626;">
                            ❌ Pedido cancelado
                        </h2>

                        <p>
                            Hola <strong>${pedidoActual.proveedor}</strong>,
                        </p>

                        <p>
                            Le informamos que el siguiente pedido
                            realizado a través de BacoApp ha sido
                            <strong>cancelado</strong>.
                        </p>

                        <p>
                            <strong>Pedido:</strong>
                            #${pedidoActual.id_pedido}
                            <br>

                            <strong>Estado:</strong>
                            Cancelado
                            <br>

                            <strong>Total:</strong>
                            $${Number(pedidoActual.total).toLocaleString("es-CO")}
                        </p>

                        <h3>Productos del pedido</h3>

                        <table style="
                            width:100%;
                            border-collapse:collapse;
                        ">

                            <thead>

                                <tr style="background:#f3f3f3;">

                                    <th style="
                                        padding:8px;
                                        text-align:left;
                                    ">
                                        Producto
                                    </th>

                                    <th style="padding:8px;">
                                        Cantidad
                                    </th>

                                    <th style="
                                        padding:8px;
                                        text-align:right;
                                    ">
                                        Precio
                                    </th>

                                    <th style="
                                        padding:8px;
                                        text-align:right;
                                    ">
                                        Subtotal
                                    </th>

                                </tr>

                            </thead>

                            <tbody>
                                ${productosCorreo}
                            </tbody>

                        </table>

                        ${
                            pedidoActual.observaciones
                                ? `
                                    <p style="margin-top:20px;">
                                        <strong>Observaciones:</strong><br>
                                        ${pedidoActual.observaciones}
                                    </p>
                                `
                                : ""
                        }

                        <p style="margin-top:25px;">
                            Por favor, tenga en cuenta que este pedido
                            ya no requiere gestión ni despacho.
                        </p>

                        <hr>

                        <p style="
                            color:#777;
                            font-size:13px;
                        ">
                            Este correo fue enviado automáticamente
                            por BacoApp.
                        </p>

                    </div>
                `
            });

            console.log(
                `Correo de cancelación del pedido #${pedidoActual.id_pedido} enviado a ${pedidoActual.correo}`
            );

        } catch (error) {

            console.error(
                `El pedido #${pedidoActual.id_pedido} fue cancelado, pero no se pudo enviar el correo:`,
                error
            );
        }

        // ==========================================
        // RESPUESTA
        // ==========================================

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

// ==========================================
// MARCAR PEDIDO COMO RECIBIDO
// ==========================================

export const recibirPedidoProveedor = async (req, res) => {

    const { id } = req.params;

    try {

        const [pedido] = await pool.query(
            `
            SELECT
                id_pedido,
                estado
            FROM pedidos_proveedor
            WHERE id_pedido = ?
            `,
            [id]
        );


        if (pedido.length === 0) {

            return res.status(404).json({
                ok: false,
                message: "Pedido no encontrado"
            });

        }


        const pedidoActual = pedido[0];


        // =========================
        // VALIDAR ESTADO
        // =========================

        if (pedidoActual.estado === "Recibido") {

            return res.status(400).json({
                ok: false,
                message: "El pedido ya está recibido"
            });

        }


        if (pedidoActual.estado === "Cancelado") {

            return res.status(400).json({
                ok: false,
                message: "No se puede recibir un pedido cancelado"
            });

        }


        // =========================
        // CAMBIAR ESTADO
        // =========================

        await pool.query(
            `
            UPDATE pedidos_proveedor
            SET estado = 'Recibido'
            WHERE id_pedido = ?
            `,
            [id]
        );


        res.json({
            ok: true,
            message: "Pedido marcado como recibido correctamente"
        });


    } catch (error) {

        console.error(
            "Error marcando pedido como recibido:",
            error
        );

        res.status(500).json({
            ok: false,
            message: "Error al marcar pedido como recibido"
        });

    }

};