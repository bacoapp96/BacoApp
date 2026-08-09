// ==========================================
// VER DETALLES DE PRODUCTO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal-producto");

    if (!modal) {
        console.error("❌ No existe #modal-producto en el HTML");
        return;
    }

    const cerrar = modal.querySelector(".cerrar");

    // ==========================================
    // BOTÓN VER DETALLES
    // ==========================================

    document.addEventListener("click", async (e) => {

        const btn = e.target.closest(".btn-ver-mas");

        if (!btn) return;

        e.preventDefault();

        const id = btn.dataset.idProducto;

        console.log("=================================");
        console.log("🔎 VER DETALLES");
        console.log("ID producto:", id);
        console.log("=================================");

        if (!id) {
            console.error("❌ El botón no tiene data-id-producto");
            return;
        }

        try {

            const respuesta = await fetch(
                `http://localhost:3000/api/productos/${id}`
            );

            console.log("Respuesta API:", respuesta.status);

            if (!respuesta.ok) {
                throw new Error(
                    `No se pudo obtener el producto. Estado: ${respuesta.status}`
                );
            }

            const producto = await respuesta.json();

            console.log("✅ Producto obtenido:", producto);

            // ==========================================
            // LLENAR MODAL
            // ==========================================

            document.getElementById("detalle-id").textContent =
                producto.id ?? "";

            document.getElementById("detalle-nombre").textContent =
                producto.nombre ?? "";

            document.getElementById("detalle-descripcion").textContent =
                producto.descripcion ?? "";

            document.getElementById("detalle-precio").textContent =
                Number(producto.precio || 0).toLocaleString("es-CO");

            document.getElementById("detalle-stock").textContent =
                producto.stock ?? 0;

            document.getElementById("detalle-categoria").textContent =
                producto.categoria ?? "";

            document.getElementById("detalle-marca").textContent =
                producto.marca ?? "";

            document.getElementById("detalle-tipo").textContent =
                producto.tipo ?? "";

            document.getElementById("detalle-pais").textContent =
                producto.pais ?? "";

            // ==========================================
            // MOSTRAR MODAL
            // ==========================================

            modal.style.display = "flex";

        } catch (error) {

            console.error("❌ Error obteniendo detalles:", error);

        }

    });

    // ==========================================
    // CERRAR CON X
    // ==========================================

    if (cerrar) {

        cerrar.addEventListener("click", () => {

            modal.style.display = "none";

        });

    }

    // ==========================================
    // CERRAR AL HACER CLICK FUERA
    // ==========================================

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

});