// ==========================
// ARRAY DE PRODUCTOS
// ==========================

const productos = [

    {
        nombre: "Whisky Old Parr",
        precio: 120000,
        stock: 10,
        categoria: "Whisky",
        ventas: 25
    },

    {
        nombre: "Ron Medellín",
        precio: 80000,
        stock: 3,
        categoria: "Ron",
        ventas: 50
    },

    {
        nombre: "Tequila José Cuervo",
        precio: 150000,
        stock: 0,
        categoria: "Tequila",
        ventas: 5
    },

    {
        nombre: "Vodka Absolut",
        precio: 95000,
        stock: 2,
        categoria: "Vodka",
        ventas: 15
    }

];


// ==========================
// ELEMENTOS HTML
// ==========================

const tablaBody = document.getElementById("tablaBody");

const buscador = document.getElementById("inputBuscar");

const btnBuscar = document.getElementById("btnBuscar");


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

        tablaBody.innerHTML += `
            <tr>

                <td>${producto.nombre}</td>

                <td>
                    $${producto.precio.toLocaleString()}
                </td>

                <td>${producto.stock}</td>

                <td>${producto.categoria}</td>

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
    const productoMasVendido = productos.reduce((max, producto) =>

        producto.ventas > max.ventas
            ? producto
            : max

    );

    masVendido.textContent = productoMasVendido.nombre;


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

mostrarProductos(productos);

actualizarStats();