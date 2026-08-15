import pool from "../config/db.js";
import crypto from "crypto";
import { crearVenta } from "./controller.venta.js";

export const crearPagoWompi = async (req, res) => {

    try {

        const {
            id_cliente,
            id_usuario,
            productos,
            subtotal,
            envio,
            total
        } = req.body;

        if (
            !productos ||
            !Array.isArray(productos) ||
            productos.length === 0
        ) {
            return res.status(400).json({
                ok: false,
                message: "El carrito está vacío"
            });
        };


        // ==============================
        // VALIDAR PRODUCTOS Y STOCK
        // ==============================

        for (const item of productos) {

            const idProducto = Number(item.idProducto);
            const cantidad = Number(item.cantidad);

            if (
                !idProducto ||
                !Number.isInteger(cantidad) ||
                cantidad <= 0
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "Producto o cantidad inválida."
                });
            }

            const [rows] = await pool.query(
                `SELECT id, nombre, precio, stock
                 FROM productos
                 WHERE id = ?`,
                [idProducto]
            );

            const producto = rows[0];

            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    message: `El producto ${idProducto} no existe.`
                });
            }

            if (Number(producto.stock) < cantidad) {
                return res.status(400).json({
                    ok: false,
                    message: `Stock insuficiente para ${producto.nombre}.`
                });
            }
        }

        // ==============================
        // TOTAL EN CENTAVOS
        // ==============================

        const amountInCents = Math.round(Number(total) * 100);

        if (!amountInCents || amountInCents <= 0) {
            return res.status(400).json({
                ok: false,
                message: "El total del pago no es válido."
            });
        }

        // ==============================
        // REFERENCIA ÚNICA
        // ==============================

        const reference = `BACO-${Date.now()}-${id_cliente}`;

        // ==============================
        // FIRMA DE INTEGRIDAD
        // ==============================

const cadena = `${reference}${amountInCents}COP${process.env.WOMPI_INTEGRITY_SECRET}`;

        const signature = crypto
            .createHash("sha256")
            .update(cadena)
            .digest("hex");

        // ==============================
        // RESPUESTA
        // ==============================

        res.json({
            ok: true,
            publicKey: process.env.WOMPI_PUBLIC_KEY,
            reference,
            amountInCents,
            currency: "COP",
            signature
        });

    } catch (error) {

        console.error("ERROR WOMPI:", error);

        res.status(500).json({
            ok: false,
            message: "No se pudo preparar el pago con Wompi"
        });
    }
};

export const confirmarPagoWompi = async (req, res) => {

    try {

        const {
            transactionId,
            id_cliente,
            id_usuario,
            productos
        } = req.body;

        if (!transactionId) {
            return res.status(400).json({
                ok: false,
                message: "Falta el ID de la transacción."
            });
        }

        const respuesta = await fetch(
            `https://api-sandbox.wompi.co/v1/transactions/${encodeURIComponent(transactionId)}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}`
                }
            }
        );

        const data = await respuesta.json();

        if (!respuesta.ok) {
            return res.status(400).json({
                ok: false,
                message: "No se pudo consultar la transacción.",
                data
            });
        }

        const transaccion = data.data;

        if (!transaccion) {
            return res.status(404).json({
                ok: false,
                message: "Transacción no encontrada."
            });
        }

        // SOLO SE CREA LA VENTA SI WOMPI APROBÓ
        if (transaccion.status !== "APPROVED") {

            return res.json({
                ok: false,
                aprobado: false,
                estado: transaccion.status
            });
        }

        // =========================
        // CREAR VENTA
        // =========================

        const ventaReq = {
            body: {
                id_cliente,
                id_usuario,
                productos
            }
        };

        let ventaResponse;

        const ventaRes = {
            status(codigo) {
                this.codigo = codigo;
                return this;
            },

            json(data) {
                ventaResponse = data;
                return this;
            }
        };

        await crearVenta(ventaReq, ventaRes);

        if (!ventaResponse?.ok) {
            return res.status(400).json({
                ok: false,
                message: "El pago fue aprobado, pero no se pudo registrar la venta.",
                error: ventaResponse?.error
            });
        }

        res.json({
            ok: true,
            aprobado: true,
            estado: "APPROVED",
            venta: ventaResponse.venta
        });

    } catch (error) {

        console.error("ERROR CONFIRMANDO WOMPI:", error);

        res.status(500).json({
            ok: false,
            message: "Error confirmando el pago."
        });
    }
};

export const webhookWompi = async (req, res) => {
    try {

        const evento = req.body;

        console.log("=== WEBHOOK WOMPI ===");
        console.log(JSON.stringify(evento, null, 2));

        if (evento.event !== "transaction.updated") {
            return res.sendStatus(200);
        }

        const transaccion = evento.data?.transaction;

        if (!transaccion) {
            return res.sendStatus(200);
        }

        console.log("REFERENCIA:", transaccion.reference);
        console.log("ESTADO:", transaccion.status);

        if (transaccion.status !== "APPROVED") {
            return res.sendStatus(200);
        }

        // AQUÍ conectaremos crearVenta()
        console.log("PAGO APROBADO:", transaccion.reference);

        return res.sendStatus(200);

    } catch (error) {

        console.error("ERROR WEBHOOK WOMPI:", error);

        return res.sendStatus(500);
    }
};