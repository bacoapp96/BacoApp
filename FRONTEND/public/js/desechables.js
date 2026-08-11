document.addEventListener("DOMContentLoaded", () => {
    console.log("Desechables cargados");
    fetch(`${window.BACKEND_URL}/api/productos/categoria/Desechables`)
    .then(res => res.json())
    .then(data => console.log(data));
    
});

const btnAgregar = document.querySelector(".btn-agregar");

if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
        console.log("Agregar desechable");
    });
}


const productos = document.querySelectorAll(".producto-card");

const modal = document.getElementById("modal-desechables");
const cerrar = document.querySelector(".cerrar");

async function mostrarDetallesDesechable(id) {
    try {
        const respuesta = await fetch(`https://bacoapp.onrender.com/api/productos/${id}`);
        const desechable = await respuesta.json();

        console.log(desechable);

        document.getElementById("id").textContent = desechable.id;
        document.getElementById("nombre").textContent = desechable.nombre;
        document.getElementById("descripcion").textContent = desechable.descripcion;
        document.getElementById("precio").textContent = desechable.precio;
        document.getElementById("stock").textContent = desechable.stock;
        document.getElementById("categoria").textContent = desechable.categoria;
        document.getElementById("marca").textContent = desechable.marca;
        document.getElementById("ventas").textContent = desechable.ventas;
        document.getElementById("fecha_creacion").textContent =
        new Date(desechable.fecha_creacion).toLocaleString("es-CO");
       
      

        modal.style.display = "flex";

    } catch (error) {
        console.error("Error al obtener el desechable:", error);
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

        mostrarDetallesDesechable(id);
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
         `${window.BACKEND_URL}/api/productos/filtros/Desechables`
    );

    const data = await response.json();


    const tipo = document.getElementById("dropdown-tipo");
    const material = document.getElementById("dropdown-material");
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

    material.innerHTML = 
    `<div data-material="todos"></div>`;

    data.material.forEach(item => {

        material.innerHTML += `
            <div data-material="${item.material}">
                ${item.material}
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

    if (!e.target.dataset.material) return;

    const materialSeleccionado = e.target.dataset.material;

    document
        .querySelectorAll(".producto-card")
        .forEach(card => {

            const materialCard = card.dataset.material;

            if (
                materialSeleccionado === "Todos" ||
                materialCard === materialSeleccionado
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