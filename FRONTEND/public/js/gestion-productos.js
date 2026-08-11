const API_URL = "/api/productos";

const formulario = document.getElementById("formProducto");
const tablaProductos = document.getElementById("tablaProductos");
const btnNuevoProducto = document.getElementById("btnNuevoProducto");
const tituloFormulario = document.querySelector("#formProducto")
    ?.closest(".panel")
    ?.querySelector(".panel-header h2");
const botonGuardar = formulario?.querySelector('button[type="submit"]');
const productosPorId = new Map();

const camposProducto = [
    "nombre",
    "marca",
    "precio",
    "stock",
    "categoria",
    "tipo",
    "pais",
    "material",
    "descripcion"
];

function restablecerFormulario() {
    delete formulario.dataset.productoId;
    if (tituloFormulario) tituloFormulario.textContent = "Agregar Producto";
    if (botonGuardar) botonGuardar.textContent = "Guardar Producto";
}

function crearCelda(valor) {
    const celda = document.createElement("td");
    celda.textContent = valor ?? "";
    return celda;
}

function crearBotonAccion(clase, icono, etiqueta, accion, id) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = clase;
    boton.title = etiqueta;
    boton.setAttribute("aria-label", etiqueta);
    boton.dataset.action = accion;
    boton.dataset.id = id;
    boton.innerHTML = `<i class="fa-solid ${icono}" aria-hidden="true"></i>`;
    return boton;
}

async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("No se pudieron obtener los productos");

        const productos = await respuesta.json();
        productosPorId.clear();
        productos.forEach((producto) => productosPorId.set(Number(producto.id), producto));
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error cargando productos:", error);
        tablaProductos.innerHTML = '<tr><td colspan="7">Error al cargar los productos</td></tr>';
    }
}

function mostrarProductos(productos) {
    tablaProductos.innerHTML = "";

    if (!productos?.length) {
        tablaProductos.innerHTML = '<tr><td colspan="7">No hay productos registrados</td></tr>';
        return;
    }

    productos.forEach((producto) => {
        const fila = document.createElement("tr");
        fila.append(
            crearCelda(producto.id),
            crearCelda(producto.nombre),
            crearCelda(producto.marca),
            crearCelda(`$${Number(producto.precio || 0).toLocaleString("es-CO")}`),
            crearCelda(producto.stock ?? 0),
            crearCelda(producto.categoria)
        );

        const acciones = document.createElement("td");
        acciones.append(
            crearBotonAccion("btn-editar", "fa-pen", "Editar producto", "editar", producto.id),
            crearBotonAccion("btn-eliminar", "fa-trash", "Eliminar producto", "eliminar", producto.id)
        );
        fila.appendChild(acciones);
        tablaProductos.appendChild(fila);
    });
}

function editarProducto(id) {
    const producto = productosPorId.get(Number(id));
    if (!producto) {
        alert("No se encontró el producto seleccionado.");
        return;
    }

    camposProducto.forEach((campo) => {
        formulario.elements[campo].value = producto[campo] ?? "";
    });
    formulario.dataset.productoId = String(producto.id);
    if (tituloFormulario) tituloFormulario.textContent = `Editar Producto #${producto.id}`;
    if (botonGuardar) botonGuardar.textContent = "Guardar cambios";
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
    formulario.elements.nombre.focus();
}

async function eliminarProducto(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.error || resultado.message || "No se pudo eliminar el producto");
        }

        alert("Producto eliminado correctamente");
        await cargarProductos();
    } catch (error) {
        console.error("Error eliminando producto:", error);
        alert(error.message);
    }
}

tablaProductos.addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-action]");
    if (!boton) return;

    if (boton.dataset.action === "editar") editarProducto(boton.dataset.id);
    if (boton.dataset.action === "eliminar") eliminarProducto(boton.dataset.id);
});

btnNuevoProducto?.addEventListener("click", () => {
    formulario.reset();
    restablecerFormulario();
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
    formulario.elements.nombre.focus();
});

formulario.addEventListener("reset", () => window.setTimeout(restablecerFormulario, 0));

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const idProducto = formulario.dataset.productoId;
    const editando = Boolean(idProducto);
    const datosFormulario = new FormData(formulario);

    try {
        const respuesta = await fetch(editando ? `${API_URL}/${idProducto}` : API_URL, {
            method: editando ? "PUT" : "POST",
            body: datosFormulario
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.error || resultado.message || "No se pudo guardar el producto");
        }

        alert(editando ? "Producto actualizado correctamente" : "Producto creado correctamente");
        formulario.reset();
        restablecerFormulario();
        await cargarProductos();
    } catch (error) {
        console.error("Error guardando producto:", error);
        alert(error.message);
    }
});

cargarProductos();
