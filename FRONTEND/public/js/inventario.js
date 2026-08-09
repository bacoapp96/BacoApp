// ==========================
// ARRAY DE PRODUCTOS
// ==========================

let productos = [];

const filtroCategoria =
document.getElementById("filtroCategoria");

const ordenStock =
    document.getElementById("ordenStock");

// ==========================
// ELEMENTOS HTML
// ==========================

const tablaBody = document.getElementById("tablaBody");

const buscador = document.getElementById("inputBuscar");

const btnBuscar = document.getElementById("btnBuscar");

async function cargarProductos(){
    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/productos"
        );

        productos = await respuesta.json();
        
        mostrarProductos(productos);

        cargarCategorias();

        actualizarStats();
    
    }catch (error){
        console.error(
            "Error al cargar productos",
            error
        );
    }
}


// CARDS
const totalProductos = document.getElementById("totalProductos");

const bajoStock = document.getElementById("bajoStock");

const masVendido = document.getElementById("masVendido");

const agotados = document.getElementById("agotados");


// ==========================
// MOSTRAR PRODUCTOS
// ==========================

function mostrarProductos(lista){

    tablaBody.innerHTML = "";

    // SI NO HAY PRODUCTOS
    if(lista.length === 0){

        tablaBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No se encontraron productos
                </td>
            </tr>
        `;

        return;
    }

    // RECORRER PRODUCTOS
    lista.forEach(producto => {

    let estado = "";
    let claseEstado = "";

    if (producto.stock === 0) {
        estado = "🔴 Agotado";
        claseEstado = "estado-agotado";
    } else if (producto.stock <= 5) {
        estado = "🟡 Bajo";
        claseEstado = "estado-bajo";
    } else {
        estado = "🟢 Disponible";
        claseEstado = "estado-disponible";
    }

    tablaBody.innerHTML += `
        <tr>

            <td>${producto.nombre}</td>

            <td>
                $${Number(producto.precio).toLocaleString("es-CO")}
            </td>

            <td>${producto.stock}</td>

            <td>${producto.categoria}</td>

            <td>
                <span class="${claseEstado}">
                    ${estado}
                </span>
            </td>

            <td>

                <button
                    class="btn-stock btn-mas"
                    onclick="cambiarStock(${producto.id},1)">
                    +
                </button>

                <button
                    class="btn-stock btn-menos"
                    onclick="cambiarStock(${producto.id},-1)">
                    -
                </button>

            </td>

        </tr>
    `;


    });
}


// ==========================
// ACTUALIZAR ESTADÍSTICAS
// ==========================

function actualizarStats(){

    // PRODUCTOS TOTALES
    totalProductos.textContent = productos.length;


    // BAJO STOCK
    const productosBajoStock = productos.filter(producto =>
        producto.stock <= 5
    );

    bajoStock.textContent = productosBajoStock.length;


    // MÁS VENDIDO
    if (productos.length > 0){

        const productoMasVendido = productos.reduce(
            (max, producto)=>
                producto.ventas > max.ventas
        ? producto
        : max

        );

        masVendido.textContent =
            productoMasVendido.nombre;

    }else {
        masVendido.textContent = "N/A";
    }

    // AGOTADOS
    const productosAgotados = productos.filter(producto =>
        producto.stock === 0
    );

    agotados.textContent = productosAgotados.length;
}


// ==========================
// BUSCADOR
// ==========================

function buscarProducto(){

    const texto = buscador.value.toLowerCase();

    const filtrados = productos.filter(producto =>

        producto.nombre.toLowerCase().includes(texto)

    );

    mostrarProductos(filtrados);
}


// EVENTO BOTÓN
btnBuscar.addEventListener("click", buscarProducto);


// EVENTO INPUT
buscador.addEventListener("keyup", buscarProducto);


// ==========================
// EVENTOS DE LAS CARDS
// ==========================


// TODOS LOS PRODUCTOS
document
.getElementById("cardTotal")
.addEventListener("click", () => {

    mostrarProductos(productos);

});


// BAJO STOCK
document
.getElementById("cardStock")
.addEventListener("click", () => {

    const filtrados = productos.filter(producto =>

        producto.stock <= 5

    );

    mostrarProductos(filtrados);

});


// MÁS VENDIDOS
document
.getElementById("cardVendidos")
.addEventListener("click", () => {

      if (productos.length === 0) {
        mostrarProductos([]);
        return;
    }

    const maxVentas = Math.max(

        ...productos.map(producto => producto.ventas)

    );

    const filtrados = productos.filter(producto =>

        producto.ventas === maxVentas

    );

    mostrarProductos(filtrados);

});


// AGOTADOS
document
.getElementById("cardAgotados")
.addEventListener("click", () => {

    const filtrados = productos.filter(producto =>

        producto.stock === 0

    );

    mostrarProductos(filtrados);

});


// ==========================
// INICIAR
// ==========================

async function cambiarStock(id, cantidad) {

    try {

        const response = await fetch(
            `http://localhost:3000/api/productos/${id}/stock`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cantidad
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        // Recargar inventario
        cargarProductos();

    } catch (error) {

        console.error("Error actualizando stock:", error);

    }

}

function cargarCategorias() {

    const categorias = [
        ...new Set(
            productos.map(producto => producto.categoria)
        )
    ];

    filtroCategoria.innerHTML =
        '<option value="">Todas</option>';

    categorias.forEach(categoria => {

        filtroCategoria.innerHTML += `
            <option value="${categoria}">
                ${categoria}
            </option>
        `;

    });

}

function filtrarCategoria() {

    const categoria = filtroCategoria.value;

    if (categoria === "") {

        mostrarProductos(productos);
        return;

    }

    const filtrados = productos.filter(producto =>
        producto.categoria === categoria
    );

    mostrarProductos(filtrados);

}

function ordenarStock() {

    let lista = [...productos];

    if (ordenStock.value === "menor") {

        lista.sort((a, b) => a.stock - b.stock);

    } else if (ordenStock.value === "mayor") {

        lista.sort((a, b) => b.stock - a.stock);

    }

    mostrarProductos(lista);

}

window.cambiarStock = cambiarStock;

filtroCategoria.addEventListener(
    "change",
    filtrarCategoria
);

ordenStock.addEventListener(
    "change",
    ordenarStock
);

cargarProductos();