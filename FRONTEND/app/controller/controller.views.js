
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';



//api del backend
export const API_URL = {
    usuarios: "http://localhost:3000/api/usuarios",
            productos: "http://localhost:3000/api/productos",
            categorias: "http://localhost:3000/api/categorias",
            busquedas: "http://localhost:3000/api/producto/busqueda",
            ofertas: "http://localhost:3000/api/ofertas"
            

   
};

const getPath = (ruta) => fileURLToPath(new URL(ruta, import.meta.url));

//controlador estatico
// Controlador para la vista index
export const getIndex = (req, res) => {
    res.sendFile(getPath("../../public/index.html"));
};

//controlador para cuenta-admin

export const getCuentaAdmin = (req, res) => {
    res.render(getPath("../../views/cuenta-admin.ejs"));
};

//conrolador para proveedores
export const getProveedores = (req, res) => {
    res.render(getPath("../../views/proveedores.ejs"));
};

//controlador para configuracion
export const getConfiguracion = (req, res) => {
    res.render(getPath("../../views/configuracion.ejs"));
};

//controlador para dashboard
export const getDashboard = (req, res) => {
    res.render(getPath("../../views/dashboard.ejs"));
};

//controlador para ayuda
export const getAyuda = (req, res) => {
    res.render(getPath("../../views/ayuda.ejs"));
};

//controlador estatico
// Controlador para la vista inventario
export const getInventario = (req, res) => {
    res.render(getPath("../../views/inventario.ejs"));
};

//controlador estatico
// controlador vista de reportes
export const getReportes = (req, res) => {
    res.render(getPath("../../views/reportes.ejs"));
};

//controlador estatico
// Controlador para la vista recovery
export const getRecovery = (req, res) => {
    res.render(getPath("../../views/recovery.ejs"));
};

//controlador estatico
// Controlador para la vista login
export const getLogin = (req, res) => {
    res.sendFile(getPath("../../public/login.html"));
};

//controlador dinamico
// Controlador para la vista tienda
export const getTienda = (req, res) => {
    res.redirect("/Inicio");
};


//controlador para vista carrito
export const getCarrito = (req, res) => {
    res.render(getPath("../../views/carrito.ejs"));
};

//controlador dinamico
//controlador cliente 
export const getCliente = (req, res) => {
    res.render(getPath("../../views/cliente.ejs"));
};

//controlador dinamico
//controlador para vista busqueda
export const getBusqueda = async (req, res) => {

    try {
        const [productos] = await pool.query("SELECT * FROM productos");

        res.render("busqueda", { productos });

    } catch (error) {
    console.error("ERROR DETALLADO:", error);
    res.status(500).json({
        message: "Error en el servidor",
        error: error.message
    });
}
};

//controlador estatico
//controlador para vista registro
export const getRegistro = (req, res) => {
    res.sendFile(getPath("../../public/registro.html"));
};

//controlador estatico
//controlador para vista registroadmin
export const getRegistroAdmin = (req, res) => {
    res.sendFile(getPath("../../public/registro-admin.html"));
};

//controlador dinamico
//controlador para vista categoria
export const getCategoria = async(req, res) => {

    try {
        const categorias = await fetch(`${API_URL.categorias}`).then(res => res.json());
        res.render(getPath("../../views/categorias.ejs"), { categorias: categorias.data });
    } catch (error) {
        console.error("Datos de categorías no disponibles", error);
        res.render(getPath("../../views/categorias.ejs"));
    }
};

//controlador dinamico
//controlador para vista inicio
export const getInicio = async (req, res) => {

    try {

        // PRODUCTOS
        const responseProductos = await fetch(API_URL.productos);
        const productos = await responseProductos.json();

        // OFERTAS
        const responseOfertas = await fetch(API_URL.ofertas);
        const ofertas = await responseOfertas.json();

        console.log("PRODUCTOS:", productos);
        console.log("OFERTAS:", ofertas);

        res.render("inicio", {
            productos: productos || [],
            ofertas: ofertas || []
        });

    } catch (error) {

        console.error("Error inicio:", error);

        res.render("inicio", {
            productos: [],
            ofertas: []
        });

    }

};

//controlador para admin
export const getAdministrador = (req, res) => {
    res.redirect("/dashboard");
};

//controlador dinamico
//controlador para vista cuenta
export const getCuenta = (req, res) => {
    res.render(getPath("../../views/cuenta.ejs"));
};
