document.addEventListener("DOMContentLoaded", async () => {

    const pago = JSON.parse(
        sessionStorage.getItem("baco_pago")
    );

    if (!pago) {
        console.error("No hay datos de la compra.");
        return;
    }

    try {

        const response = await fetch("/api/pagos/wompi/confirmar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                reference: new URLSearchParams(window.location.search).get("id"),
                id_cliente: pago.id_cliente,
                id_usuario: pago.id_usuario,
                productos: pago.productos
            })
        });

        const data = await response.json();

        console.log("CONFIRMACIÓN WOMPI:", data);

        if (!response.ok || !data.ok) {
            console.error("Pago no aprobado:", data);
            return;
        }

        sessionStorage.removeItem("baco_pago");
        localStorage.removeItem("bacoapp_cart");

        console.log("VENTA REGISTRADA CORRECTAMENTE");

    } catch (error) {

        console.error("Error confirmando pago:", error);

    }

});