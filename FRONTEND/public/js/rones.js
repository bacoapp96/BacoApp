document.addEventListener("DOMContentLoaded", () => {

    console.log("Rones cargados");

    cargarFiltros();

    // =========================
    // MODAL DETALLES
    // =========================

    const modal = document.getElementById("modal-rones");
    const cerrar = document.querySelector(".cerrar");

    document.querySelectorAll(".btn-ver-mas").forEach(btn => {

        btn.addEventListener("click", () => {

            const id = btn.dataset.id;

            console.log("ID:", id);

            mostrarDetallesRones(id);
        });

    });

    if (cerrar) {

        cerrar.addEventListener("click", () => {
            modal.style.display = "none";
        });

    }

    window.addEventListener("click", (e) => {

        if (e.target === modal) {
            modal.style.display = "none";
        }

    });


    // =========================
    // BOTÓN TODOS
    // =========================

    const btnTodos = document.getElementById("btn-todos");

    if (btnTodos) {

        btnTodos.addEventListener("click", () => {

            document.querySelectorAll(".producto-card").forEach(card => {
                card.style.display = "flex";
            });

        });

    }


    // =========================
    // DROPDOWNS
    // =========================

    const botones = document.querySelectorAll(".filtro-btn");

    botones.forEach(btn => {

        btn.addEventListener("click", (e) => {

            e.stopPropagation();

            const menu = btn.nextElementSibling;

            if (!menu) return;

            document.querySelectorAll(".dropdown").forEach(drop => {

                if (drop !== menu) {
                    drop.classList.remove("active");
                }

            });

            menu.classList.toggle("active");

        });

    });


    document.addEventListener("click", (e) => {

        if (!e.target.closest(".filtro-item")) {

            document.querySelectorAll(".dropdown").forEach(drop => {
                drop.classList.remove("active");
            });

        }

    });

});


// =====================================================
// MOSTRAR DETALLES
// =====================================================

async function mostrarDetallesRones(id) {

    try {

        const respuesta = await fetch(
            `${window.BACKEND_URL}/api/productos/${id}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el producto");
        }

        const ron = await respuesta.json();

        console.log("RON:", ron);

        document.getElementById("id").textContent = ron.id;
        document.getElementById("nombre").textContent = ron.nombre;
        document.getElementById("descripcion").textContent = ron.descripcion;
        document.getElementById("precio").textContent = ron.precio;
        document.getElementById("stock").textContent = ron.stock;
        document.getElementById("categoria").textContent = ron.categoria;
        document.getElementById("marca").textContent = ron.marca;
        document.getElementById("ventas").textContent = ron.ventas ?? 0;

        document.getElementById("tipo").textContent = ron.tipo ?? "";
        document.getElementById("pais").textContent = ron.pais ?? "";

        document.getElementById("fecha_creacion").textContent =
            new Date(ron.fecha_creacion).toLocaleString("es-CO");

        document.getElementById("modal-rones").style.display = "flex";

    } catch (error) {

        console.error("Error al obtener el ron:", error);

    }

}


// =====================================================
// CARGAR FILTROS
// =====================================================

async function cargarFiltros() {

    try {

        const response = await fetch(
            `${window.BACKEND_URL}/api/productos/filtros/Rones`
        );

        if (!response.ok) {
            throw new Error("No se pudieron cargar los filtros");
        }

        const data = await response.json();

        console.log("FILTROS RONES:", data);

        const tipo = document.getElementById("dropdown-tipo");
        const pais = document.getElementById("dropdown-pais");
        const marca = document.getElementById("dropdown-marca");

        // =========================
        // TIPO
        // =========================

        tipo.innerHTML = `<div data-tipo="Todos">Todos</div>`;

        data.tipos.forEach(item => {

            if (!item.tipo) return;

            tipo.innerHTML += `
                <div data-tipo="${item.tipo}">
                    ${item.tipo}
                </div>
            `;

        });


        // =========================
        // PAÍS
        // =========================

        pais.innerHTML = `<div data-pais="Todos">Todos</div>`;

        data.pais.forEach(item => {

            if (!item.pais) return;

            pais.innerHTML += `
                <div data-pais="${item.pais}">
                    ${item.pais}
                </div>
            `;

        });


        // =========================
        // MARCA
        // =========================

        marca.innerHTML = `<div data-marca="Todos">Todos</div>`;

        data.marca.forEach(item => {

            if (!item.marca) return;

            marca.innerHTML += `
                <div data-marca="${item.marca}">
                    ${item.marca}
                </div>
            `;

        });

    } catch (error) {

        console.error("Error cargando filtros:", error);

    }

}


// =====================================================
// FILTRO TIPO
// =====================================================

document.addEventListener("click", e => {

    if (!e.target.dataset.tipo) return;

    const seleccionado = e.target.dataset.tipo;

    document.querySelectorAll(".producto-card").forEach(card => {

        const valor = card.dataset.tipo;

        if (
            seleccionado === "Todos" ||
            valor === seleccionado
        ) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});


// =====================================================
// FILTRO PAÍS
// =====================================================

document.addEventListener("click", e => {

    if (!e.target.dataset.pais) return;

    const seleccionado = e.target.dataset.pais;

    document.querySelectorAll(".producto-card").forEach(card => {

        const valor = card.dataset.pais;

        if (
            seleccionado === "Todos" ||
            valor === seleccionado
        ) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});


// =====================================================
// FILTRO MARCA
// =====================================================

document.addEventListener("click", e => {

    if (!e.target.dataset.marca) return;

    const seleccionado = e.target.dataset.marca;

    document.querySelectorAll(".producto-card").forEach(card => {

        const valor = card.dataset.marca;

        if (
            seleccionado === "Todos" ||
            valor === seleccionado
        ) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});