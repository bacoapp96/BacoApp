import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export const crearPreferencia = async (req, res) => {

    try {

        const requestOrigin = req.get("origin") || "";
        const allowedOrigins = [
            "http://localhost:4000",
            process.env.FRONTEND_URL
        ].filter(Boolean).map(url => url.trim().replace(/\/$/, ""));

        const safeRequestOrigin = allowedOrigins.includes(requestOrigin.replace(/\/$/, ""))
            ? requestOrigin
            : "";
        const frontendUrl = (safeRequestOrigin || process.env.FRONTEND_URL || process.env.BASE_URL || "")
            .split(",")[0]
            .trim()
            .replace(/\/$/, "");

        if (!frontendUrl) {
            return res.status(500).json({
                ok: false,
                message: "Falta configurar FRONTEND_URL para los retornos de pago"
            });
        }

        const {
            id_cliente,
            id_usuario,
            productos,
            subtotal,
            envio,
            total
        } = req.body;


        // ==============================
        // VALIDAR CARRITO
        // ==============================

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
        // CREAR ITEMS MERCADO PAGO
        // ==============================

const itemsMercadoPago = productos.map(item => ({
    id: String(item.idProducto),
    title: item.nombre,
    quantity: Number(item.cantidad),
    currency_id: "COP",
    unit_price: Number(item.precio)
}));


        // ==============================
        // CREAR PREFERENCIA
        // ==============================

        const preference = new Preference(client);


        const respuesta = await preference.create({

            body: {

                items: itemsMercadoPago,


                // Guardamos información para identificar
                // posteriormente la compra.

                external_reference: JSON.stringify({

                    id_cliente,
                    id_usuario,
                    subtotal,
                    envio,
                    total

                }),


                // ==============================
                // URLS DE RETORNO
                // ==============================

                back_urls: {

                    success:
                        `${frontendUrl}/pago-exitoso`,

                    failure:
                        `${frontendUrl}/pago-fallido`,

                    pending:
                        `${frontendUrl}/pago-pendiente`

                },


                auto_return: "approved"

            }

        });


        console.log(
            "Preferencia creada:",
            respuesta.id
        );


        // ==============================
        // RESPUESTA AL FRONTEND
        // ==============================

        res.json({

            ok: true,

            preferenceId: respuesta.id,

            initPoint: respuesta.init_point

        });


    } catch (error) {

        console.error(
            "ERROR MERCADO PAGO:",
            error
        );


        res.status(500).json({

            ok: false,

            message:
                "No se pudo crear la preferencia de pago",

            error: error.message

        });

    }

};
