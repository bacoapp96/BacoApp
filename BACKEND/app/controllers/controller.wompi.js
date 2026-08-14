import pool from "../config/db.js";
import crypto from "crypto";

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
        }

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

console.log("=== WOMPI DATOS FIRMA ===");
console.log("REFERENCE:", reference);
console.log("AMOUNT IN CENTS:", amountInCents);
console.log("CURRENCY:", "COP");
console.log("SECRET LENGTH:", process.env.WOMPI_INTEGRITY_SECRET?.length);
console.log("========================");

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