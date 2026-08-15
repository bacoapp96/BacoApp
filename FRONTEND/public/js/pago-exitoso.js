document.addEventListener("DOMContentLoaded", async () => {

    const pago = JSON.parse(
        sessionStorage.getItem("baco_pago")
    );

    const transactionId =
        new URLSearchParams(window.location.search).get("id");

    if (!pago || !transactionId) {
        console.error("Faltan datos de la compra o transacción.");
        return;
    }

    try {

        const response = await fetch(
            "/api/pagos/wompi/confirmar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    transactionId,
                    id_cliente: pago.id_cliente,
                    id_usuario: pago.id_usuario,
                    productos: pago.productos
                })
            }
        );

        const data = await response.json();

        console.log("CONFIRMACIÓN WOMPI:", data);

        if (!response.ok || !data.ok) {

            console.error(
                "Pago no aprobado o venta no creada:",
                data
            );

            return;
        }

        // SOLO DESPUÉS DE CREAR LA VENTA
        sessionStorage.removeItem("baco_pago");
        localStorage.removeItem("bacoapp_cart");

        console.log(
            "VENTA REGISTRADA:",
            data.venta
        );

    } catch (error) {

        console.error(
            "ERROR CONFIRMANDO PAGO:",
            error
        );

    }

});