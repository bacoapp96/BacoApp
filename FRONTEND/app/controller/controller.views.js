
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

const normalizarUsuario = (usuario = {}) => ({
    id: usuario.Id_usuario || usuario.id || "",
    nombre: usuario.Nombre || usuario.nombre || "",
    usuario: usuario.Usuario || usuario.usuario || "",
    email: usuario.Email || usuario.email || "",
    telefono: usuario.Celular || usuario.Telefono || usuario.telefono || "",
    documento: usuario.Documento || usuario.documento || "",
    direccion: usuario.Direccion || usuario.direccion || "",
    rol: usuario.rol || usuario.Rol || ""
});

const requiereLogin = (req, res) => {
    if (!req.session?.usuario?.id) {
        res.redirect("/login");
        return false;
    }
    return true;
};

const requiereAdmin = (req, res) => {
    if (!requiereLogin(req, res)) return false;

    if (req.session.usuario.rol?.toLowerCase() !== "admin") {
        res.redirect("/cuenta");
        return false;
    }

    return true;
};

export const postLogin = async (req, res) => {
    try {
        const response = await fetch(`${API_URL.usuarios}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();

        if (!response.ok || !data.ok || !data.user) {
            return res.status(response.status === 200 ? 401 : response.status).json(data);
        }

        req.session.usuario = normalizarUsuario(data.user);
        

        res.json({
            ok: true,
            user: req.session.usuario
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "No se pudo conectar con el servidor de usuarios.",
            error: error.message
        });
    }
};

export const getSession = (req, res) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ ok: false, message: "Sesion no activa" });
    }
    res.json({
        ok: true,
        usuario: req.session.usuario
    });
};

export const putCuenta = async (req, res) => {
    if (!req.session?.usuario?.id) {
        return res.status(401).json({ ok: false, message: "Sesion no activa" });
    }

    try {
        const payload = {
            Nombre: req.body.nombre,
            Email: req.body.email,
            Celular: req.body.telefono,
            Documento: req.body.documento,
            Direccion: req.body.direccion,
            Usuario: req.body.usuario || req.session.usuario.usuario,
            rol: req.session.usuario.rol
        };

        const response = await fetch(`${API_URL.usuarios}/${req.session.usuario.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                ok: false,
                message: data.error || data.message || "No se pudo actualizar el perfil"
            });
        }

        const updatedResponse = await fetch(`${API_URL.usuarios}/${req.session.usuario.id}`);
        const updatedUser = await updatedResponse.json();
        req.session.usuario = normalizarUsuario(updatedUser);

        res.json({
            ok: true,
            usuario: req.session.usuario
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al actualizar el perfil",
            error: error.message
        });
    }
};

export const postAdministrador = async (req, res) => {
    if (!req.session?.usuario?.id) {
        return res.status(401).json({ ok: false, message: "Sesion no activa" });
    }

    if (req.session.usuario.rol?.toLowerCase() !== "admin") {
        return res.status(403).json({ ok: false, message: "No tienes permisos para crear administradores" });
    }

    try {
        const response = await fetch(`${API_URL.usuarios}/admin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                ok: false,
                message: data.message || "No se pudo crear el administrador"
            });
        }

        res.status(201).json({
            ok: true,
            message: data.message,
            id: data.id
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al crear administrador",
            error: error.message
        });
    }
};

export const postLogout = (req, res) => {
    req.destroySession?.();
    res.json({ ok: true });
};

//controlador estatico
// Controlador para la vista index
export const getIndex = (req, res) => {
    res.sendFile(getPath("../../public/index.html"));
};

//controlador para cuenta-admin

export const getCuentaAdmin = async (req, res) => {
    if (!requiereAdmin(req, res)) return;

    try {
        const response = await fetch(`${API_URL.usuarios}/${req.session.usuario.id}`);

        if (!response.ok) {
            req.destroySession?.();
            return res.redirect("/login");
        }

        const usuario = normalizarUsuario(await response.json());
        req.session.usuario = usuario;

        res.render(getPath("../../views/cuenta-admin.ejs"), { usuario });
    } catch (error) {
        console.error("Error cuenta admin:", error);
        res.render(getPath("../../views/cuenta-admin.ejs"), {
            usuario: req.session.usuario
        });
    }
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
export const getCuenta = async (req, res) => {
    if (!requiereLogin(req, res)) return;

    try {
        const response = await fetch(`${API_URL.usuarios}/${req.session.usuario.id}`);

        if (!response.ok) { 
            req.destroySession?.();
            return res.redirect("/login");
         }
    
        const usuario = normalizarUsuario(await response.json());
        req.session.usuario = usuario;

        res.render(getPath("../../views/cuenta.ejs"), { usuario });
    } catch (error) {
        console.error("Error cuenta:", error);
        res.render(getPath("../../views/cuenta.ejs"), {
            usuario: req.session.usuario
        });
    }
};
