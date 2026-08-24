document.addEventListener("DOMContentLoaded", () => {
    console.log("Gaseosas cargadas");
    fetch(`${window.BACKEND_URL}/api/productos/categoria/Gaseosas`)
    .then(res => res.json())
    .then(data => console.log(data));
    
});

const btnAgregar = document.querySelector(".btn-agregar");

if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
        console.log("Agregar gaseosa");
    });
}


const productos = document.querySelectorAll(".producto-card");

const modal = document.getElementById("modal-gaseosas");
const cerrar = document.querySelector(".cerrar");

async function mostrarDetallesGaseosa(id) {
    try {
        const respuesta = await fetch(`https://bacoapp-production.up.railway.app/api/productos/${id}`);
        const gaseosa = await respuesta.json();

      

        document.getElementById("id").textContent = gaseosa.id;
        document.getElementById("nombre").textContent = gaseosa.nombre;
        document.getElementById("descripcion").textContent = gaseosa.descripcion;
        document.getElementById("precio").textContent = gaseosa.precio;
        document.getElementById("stock").textContent = gaseosa.stock;
        document.getElementById("categoria").textContent = gaseosa.categoria;
        document.getElementById("marca").textContent = gaseosa.marca;
        document.getElementById("ventas").textContent = gaseosa.ventas;
        document.getElementById("fecha_creacion").textContent =
        new Date(gaseosa.fecha_creacion).toLocaleString("es-CO");
       
      

        modal.style.display = "flex";

    } catch (error) {
        console.error("Error al obtener la gaseosa:", error);
    }
}

if (cerrar) {
    cerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });
};

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

document.querySelectorAll(".btn-ver-mas").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;

       

        mostrarDetallesGaseosa(id);
    });
});

// filtros desplegables
// =========================================
// FILTROS
// =========================================

const botonesFiltro = document.querySelectorAll(".filtro-btn");

botonesFiltro.forEach(btn => {

    btn.addEventListener("click", (e) => {

        e.stopPropagation();

        const menu = btn.nextElementSibling;

        if (!menu) {
            return;
        }

        document.querySelectorAll(".dropdown").forEach(dropdown => {

            if (dropdown !== menu) {
                dropdown.classList.remove("active");
            }

        });

        menu.classList.toggle("active");

    });

});


// Cerrar dropdown al hacer click afuera

document.addEventListener("click", (e) => {

    if (!e.target.closest(".filtro-item")) {

        document.querySelectorAll(".dropdown").forEach(dropdown => {
            dropdown.classList.remove("active");
        });

    }

});


// =========================================
// CARGAR FILTROS
// =========================================

async function cargarFiltros() {

    try {

        const response = await fetch(
            `${window.BACKEND_URL}/api/productos/filtros/Gaseosas`
        );

        if (!response.ok) {
            throw new Error("No se pudieron cargar los filtros");
        }

        const data = await response.json();

        const tipo = document.getElementById("dropdown-tipo");
        const pais = document.getElementById("dropdown-pais");
        const marca = document.getElementById("dropdown-marca");


        // =====================================
        // TIPO
        // =====================================

        tipo.innerHTML = `
            <div data-tipo="todos">
                Todos
            </div>
        `;

        data.tipos.forEach(item => {

            tipo.innerHTML += `
                <div data-tipo="${item.tipo}">
                    ${item.tipo}
                </div>
            `;

        });


        // =====================================
        // PAÍS
        // =====================================

        pais.innerHTML = `
            <div data-pais="todos">
                Todos
            </div>
        `;

        data.pais.forEach(item => {

            pais.innerHTML += `
                <div data-pais="${item.pais}">
                    ${item.pais}
                </div>
            `;

        });


        // =====================================
        // MARCA
        // =====================================

        marca.innerHTML = `
            <div data-marca="todos">
                Todos
            </div>
        `;

        data.marca.forEach(item => {

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

cargarFiltros();


// =========================================
// FILTRAR POR TIPO
// =========================================

document.addEventListener("click", e => {

    if (!e.target.dataset.tipo) {
        return;
    }

    const seleccionado = e.target.dataset.tipo;

    document.querySelectorAll(".producto-card").forEach(card => {

        const tipoCard = card.dataset.tipo;

        if (
            seleccionado === "todos" ||
            tipoCard === seleccionado
        ) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});


// =========================================
// FILTRAR POR PAÍS
// =========================================

document.addEventListener("click", e => {

    if (!e.target.dataset.pais) {
        return;
    }

    const seleccionado = e.target.dataset.pais;

    document.querySelectorAll(".producto-card").forEach(card => {

        const paisCard = card.dataset.pais;

        if (
            seleccionado === "todos" ||
            paisCard === seleccionado
        ) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});


// =========================================
// FILTRAR POR MARCA
// =========================================

document.addEventListener("click", e => {

    if (!e.target.dataset.marca) {
        return;
    }

    const seleccionado = e.target.dataset.marca;

    document.querySelectorAll(".producto-card").forEach(card => {

        const marcaCard = card.dataset.marca;

        if (
            seleccionado === "todos" ||
            marcaCard === seleccionado
        ) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});


// =========================================
// BOTÓN TODOS
// =========================================

const btnTodos = document.getElementById("btn-todos");

if (btnTodos) {

    btnTodos.addEventListener("click", () => {

        document.querySelectorAll(".producto-card").forEach(card => {

            card.style.display = "flex";

        });

    });

}