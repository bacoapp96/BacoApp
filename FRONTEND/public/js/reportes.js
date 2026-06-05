// =========================
// ELEMENTOS HTML
// =========================

const listaReportes =
document.getElementById("listaReportes");

const tituloReporte =
document.getElementById("tituloReporte");


// =========================
// BASE DE DATOS TEMPORAL
// =========================

const ventas = [

    {
        producto:"Whisky Old Parr",
        cliente:"Juan Pérez",
        vendedor:"Carlos Ramírez",
        total:120000,
        fecha:"Lunes"
    },

    {
        producto:"Ron Medellín",
        cliente:"Laura Gómez",
        vendedor:"Carlos Ramírez",
        total:80000,
        fecha:"Martes"
    },

    {
        producto:"Tequila José Cuervo",
        cliente:"Andrés Mora",
        vendedor:"Daniel Torres",
        total:150000,
        fecha:"Miércoles"
    },

    {
        producto:"Ron Medellín",
        cliente:"Juan Pérez",
        vendedor:"Carlos Ramírez",
        total:95000,
        fecha:"Jueves"
    },

    {
        producto:"Vodka Absolut",
        cliente:"Camila Ruiz",
        vendedor:"Laura Castro",
        total:180000,
        fecha:"Viernes"
    }

];


// =========================
// MOSTRAR LISTA
// =========================

function mostrarLista(lista){

    listaReportes.innerHTML = "";

    // VALIDAR
    if(lista.length === 0){

        listaReportes.innerHTML = `

            <div class="item-reporte">

                <h3>
                    No hay resultados
                </h3>

            </div>

        `;

        return;
    }


    // RECORRER
    lista.forEach(item => {

        listaReportes.innerHTML += `

            <div class="item-reporte">

                <h3>
                    ${item.producto}
                </h3>

                <p>
                    👤 Cliente:
                    ${item.cliente}
                </p>

                <p>
                    🧑‍💼 Vendedor:
                    ${item.vendedor}
                </p>

                <p>
                    📅 Día:
                    ${item.fecha}
                </p>

                <p>
                    💰 Total:
                    $${item.total.toLocaleString()}
                </p>

            </div>

        `;
    });

}


// =========================
// CARD VENTAS DEL MES
// =========================

document
.getElementById("cardVentas")
.addEventListener("click", () => {

    tituloReporte.textContent =
    "📈 Ventas del mes";

    mostrarLista(ventas);

});


// =========================
// CARD PRODUCTOS VENDIDOS
// =========================

document
.getElementById("cardProductos")
.addEventListener("click", () => {

    tituloReporte.textContent =
    "📦 Productos vendidos";

    mostrarLista(ventas);

});


// =========================
// CARD GANANCIAS
// =========================

document
.getElementById("cardGanancias")
.addEventListener("click", () => {

    tituloReporte.textContent =
    "💰 Ganancias";

    mostrarLista(ventas);

});


// =========================
// CARD PRODUCTO TOP
// =========================

document
.getElementById("cardTop")
.addEventListener("click", () => {

    tituloReporte.textContent =
    "🏆 Producto más vendido";


    const top = ventas.filter(venta =>

        venta.producto ===
        "Ron Medellín"

    );

    mostrarLista(top);

});


// =========================
// KPI MEJOR VENDEDOR
// =========================

document
.querySelectorAll(".kpi-card")[0]
.addEventListener("click", () => {

    tituloReporte.textContent =
    "🏆 Mejor vendedor";


    const vendedorTop = ventas.filter(venta =>

        venta.vendedor ===
        "Carlos Ramírez"

    );

    mostrarLista(vendedorTop);

});


// =========================
// KPI PRODUCTO TOP SEMANAL
// =========================

document
.querySelectorAll(".kpi-card")[1]
.addEventListener("click", () => {

    tituloReporte.textContent =
    "🥃 Producto top semanal";


    const productoTop = ventas.filter(venta =>

        venta.producto ===
        "Ron Medellín"

    );

    mostrarLista(productoTop);

});


// =========================
// KPI CLIENTES NUEVOS
// =========================

document
.querySelectorAll(".kpi-card")[2]
.addEventListener("click", () => {

    tituloReporte.textContent =
    "👥 Clientes nuevos";


    const clientesNuevos = [

        {
            producto:"Primer compra",
            cliente:"Camila Ruiz",
            vendedor:"Laura Castro",
            total:180000,
            fecha:"Viernes"
        },

        {
            producto:"Primer compra",
            cliente:"Andrés Mora",
            vendedor:"Daniel Torres",
            total:150000,
            fecha:"Miércoles"
        }

    ];

    mostrarLista(clientesNuevos);

});


// =========================
// KPI CLIENTE PREMIUM
// =========================

document
.querySelectorAll(".kpi-card")[3]
.addEventListener("click", () => {

    tituloReporte.textContent =
    "💎 Cliente premium";


    const premium = ventas.filter(venta =>

        venta.cliente ===
        "Juan Pérez"

    );

    mostrarLista(premium);

});


// =========================
// INICIO
// =========================

mostrarLista(ventas);