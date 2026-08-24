
// =========================
// DATA
// =========================

let proveedores = [];
let pedidosProveedor = [];

async function cargarProveedores() {

    try {

        // =========================
        // CARGAR PROVEEDORES
        // =========================

        const respuestaProveedores = await fetch(
            "/api/proveedores"
        );

        if (!respuestaProveedores.ok) {
            throw new Error("Error al obtener proveedores");
        }

        const datosProveedores =
            await respuestaProveedores.json();


        proveedores = datosProveedores.map(proveedor => ({

            id: proveedor.id_proveedor,

            nombre: proveedor.nombre || "",

            telefono: proveedor.telefono || "",

            correo: proveedor.correo || "",

            direccion: proveedor.direccion || "",

            ciudad: proveedor.ciudad || "",

            nit: proveedor.nit || "",

            contacto: proveedor.contacto || "",

            notas: proveedor.notas || "",

            estado: proveedor.estado || "Activo",

            pedidos: 0,

            deuda: 0

        }));


        // =========================
        // CARGAR PEDIDOS REALES
        // =========================

        await cargarPedidosProveedor();


        // =========================
        // MOSTRAR PROVEEDORES
        // =========================

        mostrarProveedores(proveedores);


        // =========================
        // MOSTRAR PEDIDOS
        // =========================

        mostrarPedidosRecientes();


    } catch (error) {

        console.error(
            "Error cargando proveedores:",
            error
        );

        tabla.innerHTML = `
            <tr>
                <td colspan="6">
                    Error al cargar los proveedores.
                </td>
            </tr>
        `;

    }

}

async function cargarPedidosProveedor() {

    try {

        const respuesta = await fetch(
            "/api/pedidos-proveedor"
        );

        if (!respuesta.ok) {
            throw new Error(
                "Error al obtener pedidos"
            );
        }

        pedidosProveedor =
            await respuesta.json();


        console.log(
            "Pedidos reales:",
            pedidosProveedor
        );


        // =========================
        // CONTAR PEDIDOS POR PROVEEDOR
        // =========================

        proveedores.forEach(proveedor => {

            const pedidosDelProveedor =
                pedidosProveedor.filter(
                    pedido =>
                        Number(pedido.id_proveedor) ===
                        Number(proveedor.id)
                );

            proveedor.pedidos =
                pedidosDelProveedor.length;

        });


    } catch (error) {

        console.error(
            "Error cargando pedidos:",
            error
        );

        pedidosProveedor = [];

    }

}

function mostrarPedidosRecientes(filtro = "todos") {

    detallePedidos.innerHTML = "";

    if (!pedidosProveedor || pedidosProveedor.length === 0) {

        detallePedidos.innerHTML = `
            <div class="pedido-card">

                <h3>No hay pedidos registrados</h3>

                <p>
                    📦 Todavía no existen pedidos a proveedores.
                </p>

            </div>
        `;

        return;
    }

    // =========================
    // FILTRAR PEDIDOS
    // =========================

    const pedidosFiltrados = pedidosProveedor.filter(pedido => {

        if (filtro === "todos") {
            return true;
        }

        return pedido.estado === filtro;

    });


    // =========================
    // SIN RESULTADOS
    // =========================

    if (pedidosFiltrados.length === 0) {

        let mensaje = "No hay pedidos";

        if (filtro === "Pendiente") {
            mensaje = "No hay pedidos abiertos";
        }

        if (filtro === "Recibido") {
            mensaje = "No hay pedidos entregados";
        }

        if (filtro === "Cancelado") {
            mensaje = "No hay pedidos cancelados";
        }

        detallePedidos.innerHTML = `
            <div class="pedido-card">

                <h3>${mensaje}</h3>

                <p>
                    📦 No existen pedidos con este estado.
                </p>

            </div>
        `;

        return;
    }


    // =========================
    // MOSTRAR PEDIDOS
    // =========================

    pedidosFiltrados.forEach(pedido => {

        const fecha = new Date(
            pedido.fecha_pedido
        );

        const fechaFormateada =
            fecha.toLocaleDateString("es-CO");


        detallePedidos.innerHTML += `

            <div class="pedido-card">

                <h3>
                    Pedido #${pedido.id_pedido}
                </h3>

                <p>
                    🚚 Proveedor:
                    ${pedido.proveedor}
                </p>

                <p>
                    📅 Fecha:
                    ${fechaFormateada}
                </p>

                <p>
                    💰 Total:
                    $${Number(
                        pedido.total || 0
                    ).toLocaleString("es-CO")}
                </p>

                <p>
                    📌 Estado:

                    <span class="estado ${pedido.estado.toLowerCase()}">
                        ${pedido.estado}
                    </span>

                </p>

                <div class="pedido-acciones">

                    <button
                        class="btn ver"
                        onclick="verPedidoProveedor(${pedido.id_pedido})"
                    >
                        Ver pedido
                    </button>

                </div>

            </div>

        `;

    });

}

async function verPedidoProveedor(idPedido) {

    try {

        const respuesta = await fetch(
            `/api/pedidos-proveedor/${idPedido}`
        );

        const data = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                data.message ||
                "No se pudo obtener el pedido"
            );

        }


        const pedido = data.pedido;

        const productos = data.productos;


        // =========================
        // PRODUCTOS
        // =========================

        let productosHTML = "";


        productos.forEach(producto => {

            productosHTML += `

                <div class="producto-item">

                    <span>
                        ${producto.producto}
                    </span>

                    <span>
                        x${producto.cantidad}
                    </span>

                </div>

            `;

        });


        // =========================
        // FECHA
        // =========================

        const fecha =
            new Date(
                pedido.fecha_pedido
            ).toLocaleDateString(
                "es-CO"
            );


        // =========================
        // DETALLE
        // =========================

        detalleCompleto.innerHTML = `

            <div class="pedido-detalle-card">

                <h3>
                    Pedido #${pedido.id_pedido}
                </h3>

                <p>
                    🚚 Proveedor:
                    ${pedido.proveedor}
                </p>

                <p>
                    📅 Fecha:
                    ${fecha}
                </p>

                <p>
                    📌 Estado:

                    <span class="estado ${pedido.estado.toLowerCase()}">
                        ${pedido.estado}
                    </span>

                </p>

                ${
                    pedido.observaciones
                    ? `
                        <p>
                            📝 Observaciones:
                            ${pedido.observaciones}
                        </p>
                    `
                    : ""
                }

                <hr>

                <div class="productos-pedido">

                    ${productosHTML}

                </div>

                <hr>

                <h4>
                    💰 Total:
                    $${Number(
                        pedido.total || 0
                    ).toLocaleString("es-CO")}
                </h4>

                ${
                    pedido.estado === "Pendiente"
                    ? `
                        <button
                            class="btn cancelar"
                            onclick="cancelarPedidoReal(${pedido.id_pedido})"
                        >
                            Cancelar pedido
                        </button>
                    `
                    : ""
                }

            </div>

        `;


        // Llevar la vista hacia el detalle

        detalleCompleto.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {

        console.error(
            "Error obteniendo pedido:",
            error
        );

        alert(
            error.message ||
            "No se pudo obtener el pedido."
        );

    }

}


window.verPedidoProveedor =
    verPedidoProveedor;

// =========================
// ELEMENTOS
// =========================

const tabla =
document.getElementById("tablaProveedores");

const buscador =
document.getElementById("buscador");

const filtroEstado =
document.getElementById("filtroEstado");

const detallePedidos =
document.getElementById("detallePedidos");

const detalleCompleto =
document.getElementById("detalleCompleto");

const filtroPedidosEstado =
    document.getElementById("filtroPedidosEstado");

filtroPedidosEstado?.addEventListener("change", () => {

    const valor =
        filtroPedidosEstado.value;

    mostrarPedidosRecientes(valor);

});


// =========================
// MOSTRAR PROVEEDORES
// =========================

function mostrarProveedores(lista){

    tabla.innerHTML = "";

    lista.forEach((proveedor,index) => {

        tabla.innerHTML += `

            <tr>

                <td>${proveedor.nombre}</td>

                <td>${proveedor.telefono}</td>

                <td>${proveedor.pedidos}</td>

                <td>

                    <span class="estado ${proveedor.estado.toLowerCase()}">

                        ${proveedor.estado}

                    </span>

                </td>

                <td>

                    $${proveedor.deuda.toLocaleString()}

                </td>

                <td>

                    <div class="acciones">

                        <button 
                            class="btn ver"
                            onclick="verProveedor(${index})"
                        >
                            Ver
                        </button>

                        <button 
                            class="btn editar"
                            onclick="editarProveedor(${proveedor.id})"
                        >
                            Editar
                        </button>

                        <button 
                            class="btn cancelar"
                            
                        >
                            Cancelar
                        </button>

                        <button 
                            class="btn eliminar"
                            onclick="eliminarProveedor(${proveedor.id})"                        >
                            Eliminar
                        </button>

                    </div>

                </td>

            </tr>

        `;
    });

    actualizarKPIs();

}


// =========================
// ACTUALIZAR KPI
// =========================

function actualizarKPIs() {

    // =========================
    // PROVEEDORES ACTIVOS
    // =========================

    const activos = proveedores.filter(
        proveedor => proveedor.estado === "Activo"
    ).length;


    // =========================
    // PEDIDOS PENDIENTES
    // =========================

    const pendientes = pedidosProveedor.filter(
        pedido => pedido.estado === "Pendiente"
    ).length;


    // =========================
    // ENTREGAS HOY
    // =========================

    const hoy = new Date();

    const entregasHoy = pedidosProveedor.filter(pedido => {

        if (pedido.estado !== "Recibido") {
            return false;
        }

        const fechaPedido = new Date(
            pedido.fecha_pedido
        );

        return (
            fechaPedido.getFullYear() === hoy.getFullYear() &&
            fechaPedido.getMonth() === hoy.getMonth() &&
            fechaPedido.getDate() === hoy.getDate()
        );

    }).length;


    // =========================
    // PEDIDOS CANCELADOS
    // =========================

    const cancelados = pedidosProveedor.filter(
        pedido => pedido.estado === "Cancelado"
    ).length;


    // =========================
    // ACTUALIZAR TARJETAS
    // =========================

    document
        .querySelector("#cardActivos p")
        .textContent = activos;

    document
        .querySelector("#cardPendientes p")
        .textContent = pendientes;

document
    .getElementById("cardEntregas")
    .addEventListener("click", () => {

        filtroPedidosEstado.value = "Recibido";

        mostrarPedidosRecientes("Recibido");

    });

    document
        .querySelector("#cardDeuda p")
        .textContent = cancelados;

}

// =========================
// VER PROVEEDOR
// =========================

function verProveedor(index){

    const proveedor = proveedores[index];

    detallePedidos.innerHTML = `

        <div class="pedido-card">

            <h3>${proveedor.nombre}</h3>

            <p>📞 ${proveedor.telefono}</p>

            <p>📧 ${proveedor.correo}</p>

            <p>📍 ${proveedor.direccion}</p>

            <p>📦 Pedidos: ${proveedor.pedidos}</p>

            <p>
                💰 Deuda:
                $${proveedor.deuda.toLocaleString()}
            </p>

            <p>📌 Estado: ${proveedor.estado}</p>

            <p>
                📝 ${proveedor.notas}
            </p>

        </div>

    `;

    mostrarDetallePedido(proveedor);

}




// =========================
// DETALLE COMPLETO DEL PEDIDO
// =========================

function mostrarDetallePedido(proveedor) {

    const pedido = proveedor.detallePedido;

    if (!pedido || !pedido.productos || pedido.productos.length === 0) {

        detalleCompleto.innerHTML = `

            <div class="pedido-detalle-card">

                <h3>Sin pedidos registrados</h3>

                <p>
                    🚚 Proveedor:
                    ${proveedor.nombre}
                </p>

                <p>
                    Este proveedor todavía no tiene pedidos registrados.
                </p>

            </div>

        `;

        return;
    }


    // =========================
    // PRODUCTOS
    // =========================

    let productosHTML = "";

    pedido.productos.forEach(producto => {

        productosHTML += `

            <div class="producto-item">

                <span>
                    ${producto.nombre}
                </span>

                <span>
                    x${producto.cantidad}
                </span>

            </div>

        `;

    });


    // =========================
    // MOSTRAR DETALLE
    // =========================

    detalleCompleto.innerHTML = `

        <div class="pedido-detalle-card">

            <h3>
                Pedido ${pedido.numero}
            </h3>

            <p>
                🚚 Proveedor:
                ${proveedor.nombre}
            </p>

            <p>
                📅 Fecha:
                ${pedido.fecha}
            </p>

            <p>
                📌 Estado:
                ${proveedor.estado}
            </p>

            <hr>

            <div class="productos-pedido">

                ${productosHTML}

            </div>

            <hr>

            <h4>
                💰 Total:
                $${Number(pedido.total).toLocaleString("es-CO")}
            </h4>

        </div>

    `;
}

// =========================
// EDITAR PROVEEDOR
// =========================


async function editarProveedorLegacy(id) {

    try {

        // Buscar proveedor en la BD
        const respuesta = await fetch(
            `/api/proveedores/${id}`
        );

        const proveedor = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                proveedor.error ||
                "No se pudo obtener el proveedor"
            );

        }


        // Cambiar título del modal
        tituloModal.textContent = "Editar proveedor";


        // Guardar ID
        document.getElementById("id_proveedor").value =
            proveedor.id_proveedor;


        // Cargar datos
        document.getElementById("nombreProveedor").value =
            proveedor.nombre || "";

        document.getElementById("telefonoProveedor").value =
            proveedor.telefono || "";

        document.getElementById("correoProveedor").value =
            proveedor.correo || "";

        document.getElementById("direccionProveedor").value =
            proveedor.direccion || "";

        document.getElementById("ciudadProveedor").value =
            proveedor.ciudad || "";

        document.getElementById("nitProveedor").value =
            proveedor.nit || "";

        document.getElementById("contactoProveedor").value =
            proveedor.contacto || "";

        document.getElementById("notasProveedor").value =
            proveedor.notas || "";


        // Abrir modal
        modalProveedor.style.display = "flex";


    } catch (error) {

        console.error(
            "Error cargando proveedor:",
            error
        );

        alert(
            "No se pudo cargar la información del proveedor."
        );

    }

}


// =========================
// CANCELAR PEDIDO
// =========================

async function cancelarPedidoReal(idPedido) {

    const confirmar = confirm(
        `¿Estás seguro de cancelar el pedido #${idPedido}?`
    );

    if (!confirmar) return;

    try {

        const respuesta = await fetch(
            `/api/pedidos-proveedor/${idPedido}/cancelar`,
            {
                method: "PUT"
            }
        );

        const data = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                data.message ||
                "No se pudo cancelar el pedido."
            );

        }

        alert(
            "Pedido cancelado correctamente."
        );

        // Recargar proveedores y pedidos
        await cargarProveedores();

        // Mostrar nuevamente el pedido actualizado
        await verPedidoProveedor(idPedido);

    } catch (error) {

        console.error(
            "Error cancelando pedido:",
            error
        );

        alert(
            error.message ||
            "No se pudo cancelar el pedido."
        );

    }

}

window.cancelarPedidoReal =
    cancelarPedidoReal;


// =========================
// ELIMINAR
// =========================

async function eliminarProveedor(id) {

    const confirmar = confirm(
        "¿Estás seguro de eliminar este proveedor?"
    );

    if (!confirmar) return;

    try {

        const respuesta = await fetch(
            `/api/proveedores/${id}`,
            {
                method: "DELETE"
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                resultado.error ||
                "No se pudo eliminar el proveedor"
            );

        }

        alert(
            "Proveedor eliminado correctamente."
        );

        // Recargar desde la BD
        await cargarProveedores();

        // Limpiar detalles
        detallePedidos.innerHTML = "";
        detalleCompleto.innerHTML = "";

    } catch (error) {

        console.error(
            "Error eliminando proveedor:",
            error
        );

        alert(
            error.message ||
            "No se pudo eliminar el proveedor."
        );

    }
}

// =========================
// BUSCADOR
// =========================

buscador.addEventListener("keyup", () => {

    const texto =
    buscador.value.toLowerCase();

    const filtrados =
    proveedores.filter(proveedor =>

        proveedor.nombre
        .toLowerCase()
        .includes(texto)

    );

    mostrarProveedores(filtrados);

});


// =========================
// FILTRO
// =========================

filtroEstado.addEventListener("change", () => {

    const valor =
    filtroEstado.value;

    if(valor === "todos"){

        mostrarProveedores(proveedores);

        return;

    }

    const filtrados =
    proveedores.filter(proveedor =>

        proveedor.estado === valor

    );

    mostrarProveedores(filtrados);

});


// =========================
// CARDS
// =========================

document
.getElementById("cardActivos")
.addEventListener("click", () => {

    mostrarProveedores(

        proveedores.filter(p =>
            p.estado === "Activo"
        )

    );

});


document
    .getElementById("cardPendientes")
    .addEventListener("click", () => {

        filtroPedidosEstado.value = "Pendiente";

        mostrarPedidosRecientes("Pendiente");

    });


document
    .getElementById("cardDeuda")
    .addEventListener("click", () => {

        filtroPedidosEstado.value = "Cancelado";

        mostrarPedidosRecientes("Cancelado");

    });


// =========================
// MODAL PROVEEDOR
// =========================

const btnNuevo = document.getElementById("btnNuevo");
const modalProveedor = document.getElementById("modalProveedor");
const formProveedor = document.getElementById("formProveedor");
const cerrarModal = document.getElementById("cerrarModal");

const tituloModal = document.getElementById("tituloModal");


// =========================
// ABRIR MODAL
// =========================

btnNuevo.addEventListener("click", () => {

    tituloModal.textContent = "Nuevo proveedor";

    formProveedor.reset();

    document.getElementById("id_proveedor").value = "";

    modalProveedor.style.display = "flex";

});


// =========================
// CERRAR MODAL
// =========================

cerrarModal.addEventListener("click", () => {

    modalProveedor.style.display = "none";

});


// =========================
// CERRAR AL HACER CLICK AFUERA
// =========================

modalProveedor.addEventListener("click", (event) => {

    if (event.target === modalProveedor) {

        modalProveedor.style.display = "none";

    }

});





// =========================
// EDITAR PROVEEDOR
// =========================

async function editarProveedor(id) {

    try {

        const respuesta = await fetch(
            `/api/proveedores/${id}`
        );

        const proveedor = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                proveedor.error ||
                "No se pudo obtener el proveedor"
            );

        }


        // =========================
        // TITULO
        // =========================

        tituloModal.textContent = "Editar proveedor";


        // =========================
        // ID
        // =========================

        document.getElementById("id_proveedor").value =
            proveedor.id_proveedor;


        // =========================
        // DATOS
        // =========================

        document.getElementById("nombreProveedor").value =
            proveedor.nombre ?? "";

        document.getElementById("telefonoProveedor").value =
            proveedor.telefono ?? "";

        document.getElementById("correoProveedor").value =
            proveedor.correo ?? "";

        document.getElementById("direccionProveedor").value =
            proveedor.direccion ?? "";

        document.getElementById("ciudadProveedor").value =
            proveedor.ciudad ?? "";

        document.getElementById("nitProveedor").value =
            proveedor.nit ?? "";

        document.getElementById("contactoProveedor").value =
            proveedor.contacto ?? "";

        document.getElementById("notasProveedor").value =
            proveedor.notas ?? "";


        // =========================
        // ABRIR MODAL
        // =========================

        modalProveedor.style.display = "flex";


    } catch (error) {

        console.error(
            "Error cargando proveedor:",
            error
        );

        alert(
            "No se pudo cargar la información del proveedor."
        );

    }

}

// =========================
// GUARDAR / ACTUALIZAR
// =========================

formProveedor.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("id_proveedor").value.trim();

    const datos = {
        nombre: document.getElementById("nombreProveedor").value.trim(),
        telefono: document.getElementById("telefonoProveedor").value.trim(),
        correo: document.getElementById("correoProveedor").value.trim(),
        direccion: document.getElementById("direccionProveedor").value.trim(),
        ciudad: document.getElementById("ciudadProveedor").value.trim(),
        nit: document.getElementById("nitProveedor").value.trim(),
        contacto: document.getElementById("contactoProveedor").value.trim(),
        notas: document.getElementById("notasProveedor").value.trim()
    };

    // Determinar URL y método HTTP dependiendo de si hay ID
    const url = id ? `/api/proveedores/${id}` : "/api/proveedores";
    const metodo = id ? "PUT" : "POST";

    console.log(`${id ? "Actualizando" : "Creando"} proveedor...`);

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.error ||
                `No se pudo ${id ? "actualizar" : "crear"} el proveedor`
            );
        }

        alert(`Proveedor ${id ? "actualizado" : "creado"} correctamente.`);

        // Cerrar modal
        modalProveedor.style.display = "none";

        // Limpiar formulario y restablecer estados del modal
        formProveedor.reset();
        document.getElementById("id_proveedor").value = "";
        tituloModal.textContent = "Nuevo proveedor";

        // Recargar datos actualizados desde la BD
        await cargarProveedores();

    } catch (error) {
        console.error(`Error al procesar proveedor:`, error);
        alert(error.message || `No se pudo ${id ? "actualizar" : "crear"} el proveedor.`);
    }
});

// ==========================================
// PEDIDOS A PROVEEDORES
// ==========================================

const modalPedido = document.getElementById("modalPedido");
const formPedido = document.getElementById("formPedido");

const pedidoProveedor = document.getElementById("pedidoProveedor");
const pedidoProducto = document.getElementById("pedidoProducto");
const pedidoCantidad = document.getElementById("pedidoCantidad");

const productosPedido = document.getElementById("productosPedido");

let productosSeleccionados = [];

document.getElementById("btnNuevoPedido")?.addEventListener("click", async () => {

    productosSeleccionados = [];

    productosPedido.innerHTML = "";

    formPedido.reset();

    modalPedido.style.display = "flex";

    await cargarProveedoresPedido();
    await cargarProductosPedido();

});

document.getElementById("cerrarModalPedido")?.addEventListener("click", () => {

    modalPedido.style.display = "none";

});

modalPedido?.addEventListener("click", (event) => {

    if (event.target === modalPedido) {

        modalPedido.style.display = "none";

    }

});

async function cargarProveedoresPedido() {

    try {

        const response = await fetch("/api/proveedores");

        if (!response.ok) {
            throw new Error("No se pudieron cargar los proveedores");
        }

        const proveedores = await response.json();

        pedidoProveedor.innerHTML = `
            <option value="">
                Seleccionar proveedor
            </option>
        `;

        proveedores.forEach(proveedor => {

            const option = document.createElement("option");

            option.value = proveedor.id_proveedor;

            option.textContent = proveedor.nombre;

            pedidoProveedor.appendChild(option);

        });

    } catch (error) {

        console.error("Error cargando proveedores:", error);

        alert("No se pudieron cargar los proveedores.");

    }

}

async function cargarProductosPedido() {

    try {

        const response = await fetch("/api/productos");

        if (!response.ok) {
            throw new Error("No se pudieron cargar los productos");
        }

        const productos = await response.json();

        pedidoProducto.innerHTML = `
            <option value="">
                Seleccionar producto
            </option>
        `;

        productos.forEach(producto => {

            const option = document.createElement("option");

            option.value = producto.id;

            option.textContent =
                `${producto.nombre} - $${Number(producto.precio).toLocaleString("es-CO")}`;

            pedidoProducto.appendChild(option);

        });

    } catch (error) {

        console.error("Error cargando productos:", error);

        alert("No se pudieron cargar los productos.");

    }

}

document
    .getElementById("btnAgregarProductoPedido")
    ?.addEventListener("click", () => {

        const idProducto = Number(pedidoProducto.value);
        const cantidad = Number(pedidoCantidad.value);

        if (!idProducto) {
            alert("Selecciona un producto.");
            return;
        }

        if (!cantidad || cantidad <= 0) {
            alert("Ingresa una cantidad válida.");
            return;
        }

        const productoExistente =
            productosSeleccionados.find(
                producto => producto.id_producto === idProducto
            );

        if (productoExistente) {

            productoExistente.cantidad += cantidad;

        } else {

            const nombre =
                pedidoProducto.options[pedidoProducto.selectedIndex].textContent;

            productosSeleccionados.push({
                id_producto: idProducto,
                nombre,
                cantidad
            });

        }

        renderProductosPedido();

    });

    function renderProductosPedido() {

    productosPedido.innerHTML = "";

    productosSeleccionados.forEach((producto, index) => {

        const div = document.createElement("div");

        div.className = "producto-pedido-item";

        div.innerHTML = `
            <span>
                ${producto.nombre}
            </span>

            <span>
                x${producto.cantidad}
            </span>

            <button
                type="button"
                onclick="eliminarProductoPedido(${index})">
                ❌
            </button>
        `;

        productosPedido.appendChild(div);

    });

}

window.eliminarProductoPedido = function(index) {

    productosSeleccionados.splice(index, 1);

    renderProductosPedido();

};

formPedido?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const idProveedor = Number(pedidoProveedor.value);

    const observaciones =
        document.getElementById("pedidoObservaciones").value.trim();

    if (!idProveedor) {

        alert("Selecciona un proveedor.");

        return;

    }

    if (productosSeleccionados.length === 0) {

        alert("Agrega al menos un producto.");

        return;

    }

    const productos = productosSeleccionados.map(producto => ({
        id_producto: producto.id_producto,
        cantidad: producto.cantidad
    }));

    try {

        const response = await fetch("/api/pedidos-proveedor", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id_proveedor: idProveedor,
                productos,
                observaciones
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "No se pudo crear el pedido."
            );

        }

        alert(
            `Pedido #${data.id_pedido} creado correctamente.`
        );

        modalPedido.style.display = "none";

        formPedido.reset();

        productosSeleccionados = [];

        productosPedido.innerHTML = "";

        await cargarProveedores();

    } catch (error) {

        console.error("Error creando pedido:", error);

        alert(
            error.message ||
            "No se pudo crear el pedido."
        );

    }

});



cargarProveedores();

