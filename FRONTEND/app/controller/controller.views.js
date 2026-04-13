
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';



//api del backend
export const API_URL = {
    usuarios: "http://localhost:3000/api/usuarios",
    productos: "http://localhost:3000/api/producto",
    categorias: "http://localhost:3000/api/categorias",
    busquedas: "http://localhost:3000/api/producto/busqueda"
};

const getPath = (ruta) => fileURLToPath(new URL(ruta, import.meta.url));

//controlador estatico
// Controlador para la vista index
export const getIndex = (req, res) => {
    res.sendFile(getPath("../../public/index.html"));
};

//controlador estatico
// Controlador para la vista login
export const getLogin = (req, res) => {
    res.sendFile(getPath("../../public/login.html"));
};

//controlador dinamico
// Controlador para la vista tienda
export const getTienda = (req, res) => {
    res.render(getPath("../../views/tienda.ejs"));
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
        const categorias = await fetch(`${API_URL_CATEGORIAS}`).then(res => res.json());
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

        const response = await fetch(API_URL.productos);
        const data = await response.json();

        console.log("PRODUCTOS:", data);

        res.render("inicio", {
            productos: data || []
        });

    } catch (error) {
        console.error("Error productos inicio:", error);

        res.render("inicio", {
            productos: []
        });
    }
};
export const getAdministrador = async (req, res) => {
    try {

        // si luego quieres traer productos del backend
        const productos = await fetch(API_URL.productos)
            .then(res => res.json());

        res.render("administrador", {
            productos: productos.data || []
        });

    } catch (error) {
        console.error("Error en administrador:", error);

        res.render("administrador", {
            productos: []
        });
    }
};