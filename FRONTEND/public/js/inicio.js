// ==========================================
// VER DETALLES DE PRODUCTO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal-producto");

    if (!modal) {
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

        if (!id) {
            return;
        }

        try {

            const respuesta = await fetch(
                `${window.BACKEND_URL}/api/productos/${id}`
            );

            if (!respuesta.ok) {
                throw new Error("No se pudo obtener el producto");
            }

            const producto = await respuesta.json();

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

            modal.style.display = "flex";

        } catch (error) {

            // No mostramos información de depuración al usuario
            alert("No se pudieron cargar los detalles del producto.");

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