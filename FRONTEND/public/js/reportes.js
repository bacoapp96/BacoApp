// =========================
// ELEMENTOS HTML
// =========================

const listaReportes =
    document.getElementById("listaReportes");

const tituloReporte =
    document.getElementById("tituloReporte");

const cardVentas =
    document.getElementById("cardVentas");

const cardProductos =
    document.getElementById("cardProductos");

const ventasMes =
    document.getElementById("ventasMes");

const cardTop =
    document.getElementById("cardTop");

const productoTop =
    document.getElementById("productoTop");

const kpiMejorVendedor =
    document.getElementById("kpiMejorVendedor");

const mejorVendedor =
    document.getElementById("mejorVendedor");

const ventasMejorVendedor =
    document.getElementById("ventasMejorVendedor");

const kpiProductoTop =
    document.getElementById("kpiProductoTop");

const productoTopSemanal =
    document.getElementById("productoTopSemanal");

const unidadesProductoTop =
    document.getElementById("unidadesProductoTop");

const kpiClientesNuevos = 
document.getElementById("kpiClientesNuevos"); 

const clientesNuevos = 
document.getElementById("clientesNuevos");

// =========================
// FORMATEAR MONEDA
// =========================

function formatearMoneda(valor) {

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor || 0);

}


// =========================
// FORMATEAR FECHA
// =========================

function formatearFecha(fecha) {

    if (!fecha) {
        return "Sin fecha";
    }

    const fechaObj = new Date(fecha);

    return fechaObj.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

}


// =========================
// CARGAR VENTAS DEL MES
// =========================

async function cargarVentasMes() {

    try {

const response = await fetch("/api/ventas/mes");
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("VENTAS DEL MES:", data);


        // =========================
        // ACTUALIZAR TARJETA
        // =========================

        ventasMes.textContent =
            formatearMoneda(data.totalVentas);


        // =========================
        // ACTUALIZAR DETALLE
        // =========================

        mostrarVentasMes(data.ventas || []);


    } catch (error) {

        console.error(
            "Error cargando ventas del mes:",
            error
        );

        ventasMes.textContent = "$0";

        tituloReporte.textContent =
            "📈 Ventas del mes";

        listaReportes.innerHTML = `
            <div class="item-reporte">

                <h3>
                    Error cargando el reporte
                </h3>

                <p>
                    No se pudieron obtener
                    las ventas del mes.
                </p>

            </div>
        `;
    }
}

// =========================
// MOSTRAR VENTAS DEL MES
// =========================

function mostrarVentasMes(ventas) {

    tituloReporte.textContent =
        "📈 Ventas del mes";

    listaReportes.innerHTML = "";


    if (!ventas || ventas.length === 0) {

        listaReportes.innerHTML = `

            <div class="item-reporte">

                <h3>
                    No hay ventas este mes
                </h3>

                <p>
                    No existen ventas registradas
                    durante el mes actual.
                </p>

            </div>

        `;

        return;
    }


    ventas.forEach(venta => {

        listaReportes.innerHTML += `

            <div class="item-reporte">

                <h3>
                    Venta #${venta.Id_venta}
                </h3>

                <p>
                    📦 Producto:
                    ${venta.producto || "Sin producto"}
                </p>

                <p>
                    📦 Cantidad:
                    ${venta.Cantidad || 0}
                </p>

                <p>
                    🧑‍💼 Vendedor:
                    ${venta.vendedor || "Sin vendedor"}
                </p>

                <p>
                    📅 Fecha:
                    ${formatearFecha(venta.Fecha)}
                </p>

                <p>
                    💰 Total:
                    ${formatearMoneda(venta.Total)}
                </p>

            </div>

        `;

    });
}



// =========================
// CLICK VENTAS DEL MES
// =========================

cardVentas.addEventListener("click", async () => {

    tituloReporte.textContent = "📈 Ventas del mes";

    listaReportes.innerHTML = `
        <div class="item-reporte">
            <h3>Cargando ventas...</h3>
        </div>
    `;

    await cargarVentasMes();

});

// =========================
// CARGAR PRODUCTOS VENDIDOS
// =========================

async function cargarProductosVendidos() {

    try {

        const response =
            await fetch(
                "/api/ventas/productos-vendidos-mes"
            );


        if (!response.ok) {

            throw new Error(
                `Error HTTP: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "PRODUCTOS VENDIDOS:",
            data
        );


        const elemento =
            document.getElementById(
                "productosVendidos"
            );


        if (!elemento) {

            console.error(
                "No existe #productosVendidos"
            );

            return;
        }


        elemento.textContent =
            data.productosVendidos;


    } catch (error) {

        console.error(
            "Error cargando productos vendidos:",
            error
        );


        const elemento =
            document.getElementById(
                "productosVendidos"
            );


        if (elemento) {
            elemento.textContent = "0";
        }

    }

}

cardProductos.addEventListener(
    "click",
    async () => {

        tituloReporte.textContent =
            "📦 Productos vendidos";

        listaReportes.innerHTML = `

            <div class="item-reporte">

                <h3>
                    Productos vendidos este mes
                </h3>

                <p>
                    Total de unidades:
                    <strong id="detalleProductosVendidos">
                        Cargando...
                    </strong>
                </p>

            </div>

        `;


        try {

            const response =
                await fetch(
                    "/api/ventas/productos-vendidos-mes"
                );


            if (!response.ok) {

                throw new Error(
                    `Error HTTP: ${response.status}`
                );

            }


            const data =
                await response.json();


            document.getElementById(
                "detalleProductosVendidos"
            ).textContent =
                data.productosVendidos;


        } catch (error) {

            console.error(error);

            listaReportes.innerHTML = `

                <div class="item-reporte">

                    <h3>
                        Error
                    </h3>

                    <p>
                        No se pudieron obtener
                        los productos vendidos.
                    </p>

                </div>

            `;

        }

    }
);


// =========================
// CARGAR PRODUCTO TOP
// =========================

async function cargarProductoTop() {

    try {

        const response =
            await fetch(
                "/api/ventas/producto-top-mes"
            );

        if (!response.ok) {

            throw new Error(
                `Error HTTP: ${response.status}`
            );

        }

        const data =
            await response.json();

        console.log(
            "PRODUCTO TOP:",
            data
        );


        if (!data.hayProducto) {

            productoTop.textContent =
                "Sin ventas";

            return;
        }


        productoTop.textContent =
            data.producto.nombre;


    } catch (error) {

        console.error(
            "Error cargando producto top:",
            error
        );

        productoTop.textContent =
            "Sin datos";

    }

}

cardTop.addEventListener(
    "click",
    async () => {

        tituloReporte.textContent =
            "🏆 Producto más vendido";

        listaReportes.innerHTML = `

            <div class="item-reporte">

                <h3>
                    Cargando producto top...
                </h3>

            </div>

        `;


        try {

            const response =
                await fetch(
                    "/api/ventas/producto-top-mes"
                );


            if (!response.ok) {

                throw new Error(
                    `Error HTTP: ${response.status}`
                );

            }


            const data =
                await response.json();


            if (!data.hayProducto) {

                listaReportes.innerHTML = `

                    <div class="item-reporte">

                        <h3>
                            No hay ventas este mes
                        </h3>

                        <p>
                            No existe un producto
                            vendido durante el mes actual.
                        </p>

                    </div>

                `;

                return;
            }


            listaReportes.innerHTML = `

                <div class="item-reporte">

                    <h3>
                        🏆 ${data.producto.nombre}
                    </h3>

                    <p>
                        📦 Unidades vendidas:
                        ${data.producto.unidadesVendidas}
                    </p>

                </div>

            `;


        } catch (error) {

            console.error(
                "Error obteniendo producto top:",
                error
            );


            listaReportes.innerHTML = `

                <div class="item-reporte">

                    <h3>
                        Error
                    </h3>

                    <p>
                        No se pudo obtener
                        el producto más vendido.
                    </p>

                </div>

            `;

        }

    }
);

// =========================
// CARGAR MEJOR VENDEDOR
// =========================

async function cargarMejorVendedor() {

    try {

        const response =
            await fetch(
                "/api/ventas/mejor-vendedor-mes"
            );


        if (!response.ok) {

            throw new Error(
                `Error HTTP: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "MEJOR VENDEDOR:",
            data
        );


        if (!data.hayVendedor) {

            mejorVendedor.textContent =
                "Sin ventas";

            ventasMejorVendedor.textContent =
                "0 ventas este mes";

            return;
        }


        mejorVendedor.textContent =
            data.vendedor.nombre;


        ventasMejorVendedor.textContent =
            `${data.vendedor.cantidadVentas} ventas este mes`;


    } catch (error) {

        console.error(
            "Error cargando mejor vendedor:",
            error
        );


        mejorVendedor.textContent =
            "Sin datos";

        ventasMejorVendedor.textContent =
            "No disponible";

    }

}

kpiMejorVendedor.addEventListener(
    "click",
    async () => {

        tituloReporte.textContent =
            "🏆 Mejor vendedor";


        listaReportes.innerHTML = `

            <div class="item-reporte">

                <h3>
                    Cargando...
                </h3>

            </div>

        `;


        try {

            const response =
                await fetch(
                    "/api/ventas/mejor-vendedor-mes"
                );


            if (!response.ok) {

                throw new Error(
                    `Error HTTP: ${response.status}`
                );

            }


            const data =
                await response.json();


            if (!data.hayVendedor) {

                listaReportes.innerHTML = `

                    <div class="item-reporte">

                        <h3>
                            No hay ventas este mes
                        </h3>

                        <p>
                            Todavía no existen ventas
                            registradas durante este mes.
                        </p>

                    </div>

                `;

                return;
            }


            listaReportes.innerHTML = `

                <div class="item-reporte">

                    <h3>
                        🏆 ${data.vendedor.nombre}
                    </h3>

                    <p>
                        🧾 Ventas realizadas:
                        ${data.vendedor.cantidadVentas}
                    </p>

                    <p>
                        💰 Total vendido:
                        ${formatearMoneda(
                            data.vendedor.totalVendido
                        )}
                    </p>

                </div>

            `;


        } catch (error) {

            console.error(
                "Error obteniendo mejor vendedor:",
                error
            );


            listaReportes.innerHTML = `

                <div class="item-reporte">

                    <h3>
                        Error
                    </h3>

                    <p>
                        No se pudo obtener
                        el mejor vendedor.
                    </p>

                </div>

            `;

        }

    }
);

// =========================
// CARGAR TOP PRODUCTOS
// =========================

async function cargarProductoTopSemanal() {

    try {

        const response = await fetch(
            "/api/ventas/producto-top-semanal"
        );

        if (!response.ok) {
            throw new Error(
                `Error HTTP: ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            "PRODUCTO TOP SEMANAL:",
            data
        );

        if (!data.hayProducto) {

            productoTopSemanal.textContent =
                "Sin ventas";

            unidadesProductoTop.textContent =
                "0 unidades vendidas";

            return;
        }

        productoTopSemanal.textContent =
            data.producto.nombre;

        unidadesProductoTop.textContent =
            `${data.producto.unidadesVendidas} unidades vendidas`;

    } catch (error) {

        console.error(
            "Error cargando producto top semanal:",
            error
        );

        productoTopSemanal.textContent =
            "Sin datos";

        unidadesProductoTop.textContent =
            "No disponible";

    }

}
// =========================
// CLICK PRODUCTO TOP SEMANAL
// =========================

kpiProductoTop.addEventListener(
    "click",
    async () => {

        tituloReporte.textContent =
            "🥃 Producto top semanal";

        listaReportes.innerHTML = `
            <div class="item-reporte">

                <h3>
                    Cargando...
                </h3>

            </div>
        `;

        try {

            const response =
                await fetch(
                    "/api/ventas/producto-top-semanal"
                );

            if (!response.ok) {

                throw new Error(
                    `Error HTTP: ${response.status}`
                );

            }

            const data =
                await response.json();

            console.log(
                "PRODUCTO TOP SEMANAL CLICK:",
                data
            );

            if (!data.hayProducto) {

                listaReportes.innerHTML = `
                    <div class="item-reporte">

                        <h3>
                            No hay ventas esta semana
                        </h3>

                        <p>
                            No existen productos vendidos
                            durante los últimos 7 días.
                        </p>

                    </div>
                `;

                return;
            }

            listaReportes.innerHTML = `
                <div class="item-reporte">

                    <h3>
                        🥃 ${data.producto.nombre}
                    </h3>

                    <p>
                        📦 Unidades vendidas:
                        ${data.producto.unidadesVendidas}
                    </p>

                </div>
            `;

        } catch (error) {

            console.error(
                "Error obteniendo producto top semanal:",
                error
            );

            listaReportes.innerHTML = `
                <div class="item-reporte">

                    <h3>
                        Error
                    </h3>

                    <p>
                        No se pudo obtener
                        el producto top semanal.
                    </p>

                </div>
            `;

        }

    }
);

async function cargarClientesNuevos() {
    try {
        const response = await fetch(
            "/api/clientes/nuevos-mes"
            );

            if (!response.ok) {
                throw new Error(
                    `Error HTTP: ${response.status}`
            ); 
        }

        const data = await response.json();

        console.log( 
            "CLIENTES NUEVOS:", 
            data
        );

        clientesNuevos.textContent = 
            data.cantidad;

        } catch (error) { 
            console.error( 
                "Error cargando clientes nuevos:", 
                error 
            );
        
    
        clientesNuevos.textContent = "0"; 
    } 
}


// =========================
// CLICK CLIENTES NUEVOS
// =========================

kpiClientesNuevos.addEventListener(
    "click",
    async () => {

        tituloReporte.textContent =
            "👥 Clientes nuevos";

        listaReportes.innerHTML = `
            <div class="item-reporte">
                <h3>Cargando clientes...</h3>
            </div>
        `;

        try {

            const response = await fetch(
                "/api/clientes/nuevos-mes"
            );

            if (!response.ok) {
                throw new Error(
                    `Error HTTP: ${response.status}`
                );
            }

            const data = await response.json();

            console.log(
                "DETALLE CLIENTES NUEVOS:",
                data
            );

            if (
                !data.clientes ||
                data.clientes.length === 0
            ) {

                listaReportes.innerHTML = `
                    <div class="item-reporte">

                        <h3>
                            No hay clientes nuevos
                        </h3>

                        <p>
                            No se han registrado
                            clientes durante este mes.
                        </p>

                    </div>
                `;

                return;
            }

            listaReportes.innerHTML = "";

            data.clientes.forEach(cliente => {

                listaReportes.innerHTML += `

                    <div class="item-reporte">

                        <h3>
                            👤 ${cliente.nombre}
                        </h3>

                        <p>
                            📧 ${cliente.correo || "Sin correo"}
                        </p>

                        <p>
                            📱 ${cliente.telefono || "Sin teléfono"}
                        </p>

                        <p>
                            🏷️ Tipo:
                            ${cliente.tipo || "Sin tipo"}
                        </p>

                        <p>
                            ⭐ Nivel:
                            ${cliente.nivel || "Sin nivel"}
                        </p>

                        <p>
                            📅 Registro:
                            ${formatearFecha(
                                cliente.fechaRegistro
                            )}
                        </p>

                    </div>

                `;

            });

        } catch (error) {

            console.error(
                "Error obteniendo clientes nuevos:",
                error
            );

            listaReportes.innerHTML = `
                <div class="item-reporte">

                    <h3>
                        Error
                    </h3>

                    <p>
                        No se pudieron obtener
                        los clientes nuevos.
                    </p>

                </div>
            `;

        }

    }
);

// =========================
// CARGAR VENTAS SEMANALES
// =========================

async function cargarVentasSemanales() {

    try {

        const response = await fetch(
            "/api/ventas/semana"
        );

        if (!response.ok) {

            throw new Error(
                `Error HTTP: ${response.status}`
            );

        }

        const data = await response.json();

        console.log(
            "VENTAS SEMANALES:",
            data
        );

        const barras =
            document.querySelectorAll(".grafica .barra");

        if (barras.length !== 7) {

            console.error(
                "La gráfica debe tener exactamente 7 barras."
            );

            return;
        }

        // =========================
        // CREAR LOS 7 DÍAS
        // =========================

        const ventas = [
            0, // Lunes
            0, // Martes
            0, // Miércoles
            0, // Jueves
            0, // Viernes
            0, // Sábado
            0  // Domingo
        ];


        // =========================
        // COLOCAR VENTAS
        // =========================

        data.ventas.forEach(item => {

            ventas[item.dia] =
                Number(item.total) || 0;

        });


        console.log(
            "VENTAS POR DÍA:",
            ventas
        );


        // =========================
        // BUSCAR LA VENTA MÁS ALTA
        // =========================

        const maxVenta =
            Math.max(...ventas);


        // =========================
        // ALTURA MÁXIMA
        // =========================

        const alturaMaxima = 300;


        // =========================
        // ACTUALIZAR BARRAS
        // =========================

        barras.forEach((barra, index) => {

            const venta =
                ventas[index];

            let altura = 0;

            if (maxVenta > 0) {

                altura =
                    (venta / maxVenta) *
                    alturaMaxima;

            }

            barra.style.height =
                `${altura}px`;

        });

    } catch (error) {

        console.error(
            "Error cargando ventas semanales:",
            error
        );

    }

}

// =========================
// CARGAR ÚLTIMAS VENTAS
// =========================

async function cargarUltimasVentas() {

    const tabla =
        document.getElementById("ultimasVentas");

    try {

        const response = await fetch(
            "/api/ventas/ultimas"
        );

        if (!response.ok) {

            throw new Error(
                `Error HTTP: ${response.status}`
            );

        }

        const ventas =
            await response.json();

        console.log(
            "ÚLTIMAS VENTAS:",
            ventas
        );


        if (!ventas || ventas.length === 0) {

            tabla.innerHTML = `
                <tr>

                    <td colspan="4">
                        No hay ventas registradas.
                    </td>

                </tr>
            `;

            return;
        }


        tabla.innerHTML = "";


        ventas.forEach(venta => {

            tabla.innerHTML += `

                <tr>

                    <td>
                        ${venta.producto || "Sin producto"}
                    </td>

                    <td>
                        ${venta.cliente || "Sin cliente"}
                    </td>

                    <td>
                        ${formatearFecha(venta.Fecha)}
                    </td>

                    <td>
                        ${formatearMoneda(venta.Total)}
                    </td>

                </tr>

            `;

        });


    } catch (error) {

        console.error(
            "Error cargando últimas ventas:",
            error
        );

        tabla.innerHTML = `

            <tr>

                <td colspan="4">
                    No se pudieron cargar
                    las últimas ventas.
                </td>

            </tr>

        `;

    }

}


// =========================
// INICIO
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarVentasMes();
        cargarProductosVendidos();
        cargarProductoTop();
        cargarMejorVendedor();
        cargarProductoTopSemanal();
        cargarClientesNuevos();
        cargarVentasSemanales();
        cargarUltimasVentas();

    }
);