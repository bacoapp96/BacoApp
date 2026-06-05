
// =========================
// DATA
// =========================

let proveedores = [

    {
        nombre:"AndesLiquor",
        telefono:"3215559988",
        correo:"andes@gmail.com",
        direccion:"Bogotá",
        descripcion:"Proveedor premium de whisky y ron.",
        pedidos:15,
        estado:"Activo",
        deuda:850000,

        detallePedido:{
            numero:"#204",
            fecha:"28/05/2026",
            total:2500000,

            productos:[
                {
                    nombre:"Whisky Old Parr",
                    cantidad:10
                },

                {
                    nombre:"Ron Medellín",
                    cantidad:20
                }
            ]
        }
    },

    {
        nombre:"Licores Premium",
        telefono:"3108881122",
        correo:"premium@gmail.com",
        direccion:"Medellín",
        descripcion:"Distribuidor nacional de tequila.",
        pedidos:8,
        estado:"Pendiente",
        deuda:420000,

        detallePedido:{
            numero:"#178",
            fecha:"27/05/2026",
            total:1800000,

            productos:[
                {
                    nombre:"Tequila José Cuervo",
                    cantidad:12
                },

                {
                    nombre:"Aguardiente Antioqueño",
                    cantidad:25
                }
            ]
        }
    }

];


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
                            onclick="editarProveedor(${index})"
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
                            onclick="eliminarProveedor(${index})"
                        >
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

function actualizarKPIs(){

    const activos =
    proveedores.filter(p =>
        p.estado === "Activo"
    ).length;

    const pendientes =
    proveedores.filter(p =>
        p.estado === "Pendiente"
    ).length;

    const deudaTotal =
    proveedores.reduce((total,p) =>
        total + p.deuda
    ,0);

    document
    .querySelector("#cardActivos p")
    .textContent = activos;

    document
    .querySelector("#cardPendientes p")
    .textContent = pendientes;

    document
    .querySelector("#cardEntregas p")
    .textContent = 4;

    document
    .querySelector("#cardDeuda p")
    .textContent =
    `$${deudaTotal.toLocaleString()}`;

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
                📝 ${proveedor.descripcion}
            </p>

        </div>

    `;

    mostrarDetallePedido(proveedor);

}


// =========================
// DETALLE PEDIDO
// =========================

function mostrarDetallePedido(proveedor){

    let productosHTML = "";

    proveedor.detallePedido.productos.forEach(producto => {

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

    detalleCompleto.innerHTML = `

        <div class="pedido-detalle-card">

            <h3>
                Pedido ${proveedor.detallePedido.numero}
            </h3>

            <p>
                🚚 ${proveedor.nombre}
            </p>

            <p>
                📅 ${proveedor.detallePedido.fecha}
            </p>

            <p>
                📌 ${proveedor.estado}
            </p>

            <hr>

            <div class="productos-pedido">

                ${productosHTML}

            </div>

            <hr>

            <h4>

                💰 Total:
                $${proveedor.detallePedido.total.toLocaleString()}

            </h4>

        </div>

    `;
}


// =========================
// EDITAR
// =========================

function editarProveedor(index){

    const proveedor =
    proveedores[index];

    const nuevoNombre =
    prompt(
        "Nombre:",
        proveedor.nombre
    );

    if(!nuevoNombre) return;

    const nuevoTelefono =
    prompt(
        "Teléfono:",
        proveedor.telefono
    );

    const nuevoCorreo =
    prompt(
        "Correo:",
        proveedor.correo
    );

    const nuevaDireccion =
    prompt(
        "Dirección:",
        proveedor.direccion
    );

    const nuevaDescripcion =
    prompt(
        "Descripción:",
        proveedor.descripcion
    );

    proveedor.nombre =
    nuevoNombre;

    proveedor.telefono =
    nuevoTelefono;

    proveedor.correo =
    nuevoCorreo;

    proveedor.direccion =
    nuevaDireccion;

    proveedor.descripcion =
    nuevaDescripcion;

    mostrarProveedores(proveedores);

    verProveedor(index);

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

function eliminarProveedor(index){

    const confirmar =
    confirm("¿Eliminar proveedor?");

    if(confirmar){

        proveedores.splice(index,1);

        mostrarProveedores(proveedores);

        detallePedidos.innerHTML = "";

        detalleCompleto.innerHTML = "";

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
// PEDIDO ATRASADO
// =========================

document
.getElementById("pedidoAtrasado")
.addEventListener("click", () => {

    detallePedidos.innerHTML = `

        <div class="pedido-card">

            <h3>
                🚫 Pedido atrasado
            </h3>

            <p>
                AndesLiquor
            </p>

            <p>
                Retraso de 3 días
            </p>

        </div>

    `;

});


// =========================
// NUEVO PROVEEDOR
// =========================

document
.getElementById("btnNuevo")
.addEventListener("click", () => {

    const nombre =
    prompt("Nombre del proveedor:");

    if(!nombre) return;

    const telefono =
    prompt("Teléfono:");

    const correo =
    prompt("Correo:");

    const direccion =
    prompt("Dirección:");

    const descripcion =
    prompt("Descripción:");

    proveedores.push({

        nombre,
        telefono,
        correo,
        direccion,
        descripcion,

        pedidos:0,
        estado:"Activo",
        deuda:0,

        detallePedido:{
            numero:"#000",
            fecha:"Sin pedidos",
            total:0,
            productos:[]
        }

    });

    mostrarProveedores(proveedores);

});


// =========================
// INICIO
// =========================

mostrarProveedores(proveedores);
