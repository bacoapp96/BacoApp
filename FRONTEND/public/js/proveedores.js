
// =========================
// DATA
// =========================

let proveedores = [];

async function cargarProveedores() {

    try {

        const respuesta = await fetch(
            "https://bacoapp.onrender.com/api/proveedores"
        );

        if (!respuesta.ok) {
            throw new Error("Error al obtener proveedores");
        }

        const datos = await respuesta.json();

        proveedores = datos.map(proveedor => ({
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

            // Mientras todavía no tenemos pedidos
            pedidos: 0,
            deuda: 0,

            detallePedido: {
                numero: "",
                fecha: "",
                total: 0,
                productos: []
            }
        }));

        mostrarProveedores(proveedores);

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
                            onclick="cancelarPedido(${index})"
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

    const activos = proveedores.filter(
        p => p.estado === "Activo"
    ).length;

    const pendientes = proveedores.filter(
        p => p.estado === "Pendiente"
    ).length;

    const deudaTotal = proveedores.reduce(
        (total, p) => total + Number(p.deuda || 0),
        0
    );

    document
        .querySelector("#cardActivos p")
        .textContent = activos;

    document
        .querySelector("#cardPendientes p")
        .textContent = pendientes;

    document
        .querySelector("#cardEntregas p")
        .textContent = "0";

    document
        .querySelector("#cardDeuda p")
        .textContent =
        `$${deudaTotal.toLocaleString("es-CO")}`;
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


async function editarProveedor(id) {

    try {

        // Buscar proveedor en la BD
        const respuesta = await fetch(
            `https://bacoapp.onrender.com/api/proveedores/${id}`
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

function cancelarPedido(index){

    const confirmar =
    confirm("¿Cancelar pedido?");

    if(confirmar){

        proveedores[index].estado =
        "Cancelado";

        mostrarProveedores(proveedores);

        verProveedor(index);

    }

}


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
            `https://bacoapp.onrender.com/api/proveedores/${id}`,
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

    mostrarProveedores(

        proveedores.filter(p =>
            p.estado === "Pendiente"
        )

    );

});


document
.getElementById("cardDeuda")
.addEventListener("click", () => {

    mostrarProveedores(

        proveedores.filter(p =>
            p.deuda > 0
        )

    );

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
            `https://bacoapp.onrender.com/api/proveedores/${id}`
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

    const id =
        document.getElementById("id_proveedor").value.trim();

    // Verificar que estamos editando un proveedor
    if (!id) {
        alert("No se encontró el proveedor que deseas editar.");
        console.error("ID proveedor vacío");
        return;
    }

    const datos = {

        nombre:
            document.getElementById("nombreProveedor").value.trim(),

        telefono:
            document.getElementById("telefonoProveedor").value.trim(),

        correo:
            document.getElementById("correoProveedor").value.trim(),

        direccion:
            document.getElementById("direccionProveedor").value.trim(),

        ciudad:
            document.getElementById("ciudadProveedor").value.trim(),

        nit:
            document.getElementById("nitProveedor").value.trim(),

        contacto:
            document.getElementById("contactoProveedor").value.trim(),

        notas:
            document.getElementById("notasProveedor").value.trim()

    };


    console.log("Actualizando proveedor:", id);
    console.log("Datos enviados:", datos);


    try {

        const respuesta = await fetch(
            `https://bacoapp.onrender.com/api/proveedores/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datos)
            }
        );


        const resultado =
            await respuesta.json();


        console.log("Respuesta del servidor:", resultado);


        if (!respuesta.ok) {

            throw new Error(
                resultado.error ||
                "No se pudo actualizar el proveedor"
            );

        }


        alert(
            "Proveedor actualizado correctamente."
        );


        // Cerrar modal
        modalProveedor.style.display = "none";


        // Limpiar formulario
        formProveedor.reset();

        document.getElementById(
            "id_proveedor"
        ).value = "";


        // Volver al título de nuevo proveedor
        tituloModal.textContent =
            "Nuevo proveedor";


        // Recargar datos desde BD
        await cargarProveedores();


    } catch (error) {

        console.error(
            "Error actualizando proveedor:",
            error
        );

        alert(
            error.message ||
            "No se pudo actualizar el proveedor."
        );

    }

});


cargarProveedores();

