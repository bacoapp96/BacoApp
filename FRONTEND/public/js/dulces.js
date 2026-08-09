document.addEventListener("DOMContentLoaded", () => {
    console.log("Dulces cargados");
    fetch("http://localhost:3000/api/productos/categoria/Dulces")
    .then(res => res.json())
    .then(data => console.log(data));
    
});

const btnAgregar = document.querySelector(".btn-agregar");

if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
        console.log("Agregar dulces");
    });
}


const productos = document.querySelectorAll(".producto-card");

const modal = document.getElementById("modal-dulces");
const cerrar = document.querySelector(".cerrar");

async function mostrarDetallesDulces(id) {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/productos/${id}`);
        const dulce = await respuesta.json();

        console.log(dulce);

        document.getElementById("id").textContent = dulce.id;
        document.getElementById("nombre").textContent = dulce.nombre;
        document.getElementById("descripcion").textContent = dulce.descripcion;
        document.getElementById("precio").textContent = dulce.precio;
        document.getElementById("stock").textContent = dulce.stock;
        document.getElementById("categoria").textContent = dulce.categoria;
        document.getElementById("marca").textContent = dulce.marca;
        document.getElementById("ventas").textContent = dulce.ventas;
        document.getElementById("fecha_creacion").textContent =
        new Date(dulce.fecha_creacion).toLocaleString("es-CO");
       
      

        modal.style.display = "flex";

    } catch (error) {
        console.error("Error al obtener el dulce:", error);
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

        mostrarDetallesDulces(id);
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
         "http://localhost:3000/api/productos/filtros/Dulces"
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