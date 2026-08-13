document.addEventListener("DOMContentLoaded", () => {
    console.log("Ginebras cargados");
    fetch(`${window.BACKEND_URL}/api/productos/categoria/Ginebras`)
    .then(res => res.json())
    .then(data => console.log(data));
    
});

const btnAgregar = document.querySelector(".btn-agregar");

if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
        console.log("Agregar ginebra");
    });
}


const productos = document.querySelectorAll(".producto-card");

const modal = document.getElementById("modal-ginebras");
const cerrar = document.querySelector(".cerrar");

async function mostrarDetallesGinebra(id) {
    try {
        const respuesta = await fetch(`https://bacoapp-production.up.railway.app/api/productos/${id}`);
        const ginebra = await respuesta.json();

        console.log(ginebra);

        document.getElementById("id").textContent = ginebra.id;
        document.getElementById("nombre").textContent = ginebra.nombre;
        document.getElementById("descripcion").textContent = ginebra.descripcion;
        document.getElementById("precio").textContent = ginebra.precio;
        document.getElementById("stock").textContent = ginebra.stock;
        document.getElementById("categoria").textContent = ginebra.categoria;
        document.getElementById("marca").textContent = ginebra.marca;
        document.getElementById("ventas").textContent = ginebra.ventas;
        document.getElementById("fecha_creacion").textContent =
        new Date(ginebra.fecha_creacion).toLocaleString("es-CO");
       
      

        modal.style.display = "flex";

    } catch (error) {
        console.error("Error al obtener el ginebra:", error);
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

        console.log("ID:", id);

        mostrarDetallesGinebra(id);
    });
});

// filtros desplegables
const botones = document.querySelectorAll(".filtro-btn");

botones.forEach(btn => {

    btn.addEventListener("click", () => {

        const menu = btn.nextElementSibling;

        document.querySelectorAll(".dropdown").forEach(drop => {

            if(drop !== menu){
                drop.classList.remove("active");
            }

        });

        menu.classList.toggle("active");

    });

});

document.addEventListener("click", (e) => {

    if(!e.target.closest(".filtro-item")){

        document.querySelectorAll(".dropdown").forEach(drop => {
            drop.classList.remove("active");
        });

    }

});

async function cargarFiltros(){

    const response = await fetch (
         `${window.BACKEND_URL}/api/productos/filtros/Ginebras`
    );

    const data = await response.json();


    const tipo = document.getElementById("dropdown-tipo");
    const pais = document.getElementById("dropdown-pais");
    const marca = document.getElementById("dropdown-marca");
 

    tipo.innerHTML =
    `<div data-tipo="todos"></div>`;

    data.tipos.forEach(item =>{

        tipo.innerHTML +=  `
            <div data-tipo="${item.tipo}">
                ${item.tipo}
            </div>
        `;
    });

    pais.innerHTML = 
    `<div data-pais="todos"></div>`;

    data.pais.forEach(item => {

        pais.innerHTML += `
            <div data-pais="${item.pais}">
                ${item.pais}
            </div>
        `;

    });

    marca.innerHTML =
    `<div data-marca=""></div>`;

    data.marca.forEach(item => {

        marca.innerHTML += `
            <div data-marca="${item.marca}">
                ${item.marca}
            </div>
        `;

    });
}

cargarFiltros();

document.addEventListener("click", e => {

    if (!e.target.dataset.tipo) return;

    const tipoSeleccionado = e.target.dataset.tipo;

    document
        .querySelectorAll(".producto-card")
        .forEach(card => {

            const tipoCard = card.dataset.tipo;

            if (
                tipoSeleccionado === "Todos" ||
                tipoCard === tipoSeleccionado
            ) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }

        });

});

document.addEventListener("click", e => {

    if (!e.target.dataset.pais) return;

    const paisSeleccionado = e.target.dataset.pais;

    document
        .querySelectorAll(".producto-card")
        .forEach(card => {

            const paisCard = card.dataset.pais;

            if (
                paisSeleccionado === "Todos" ||
                paisCard === paisSeleccionado
            ) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }

        });

});

document.addEventListener("click", e => {

    if (!e.target.dataset.marca) return;

    const marcaSeleccionado = e.target.dataset.marca;

    document
        .querySelectorAll(".producto-card")
        .forEach(card => {

            const marcaCard = card.dataset.marca;

            if (
                marcaSeleccionado === "Todos" ||
                marcaCard === marcaSeleccionado
            ) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }

        });

});

document.getElementById("btn-todos").addEventListener("click", () =>{

document.querySelectorAll(".producto-card").forEach(card =>{
    card.style.display = "flex";
});

});