
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { totalmem } from 'os';




//api del backend
const BACKEND_URL =
    process.env.BACKEND_URL ||
    "https://bacoapp-production.up.railway.app";

export const API_URL = {
    usuarios: `${BACKEND_URL}/api/usuarios`,
    productos: `${BACKEND_URL}/api/productos`,
    clientes: `${BACKEND_URL}/api/clientes`,
    categorias: `${BACKEND_URL}/api/categorias`,
    busquedas: `${BACKEND_URL}/api/producto/busqueda`,
    ofertas: `${BACKEND_URL}/api/ofertas`,
    ventas: `${BACKEND_URL}/api/ventas`
};

const getPath = (ruta) => fileURLToPath(new URL(ruta, import.meta.url));

const normalizarUsuario = (usuario = {}) => {
    // La sesión del frontend es la fuente que consume el checkout. Conservamos
    // explícitamente los nombres del API para no perder la relación usuario-cliente.
    const Id_usuario = usuario.Id_usuario ?? usuario.id ?? "";
    const Id_cliente = usuario.Id_cliente ?? usuario.id_cliente ?? "";

    return {
    Id_usuario,
    Id_cliente,
    // Alias existentes para no romper las vistas que ya usan estas propiedades.
    id: Id_usuario,
    nombre: usuario.Nombre || usuario.nombre || "",
    usuario: usuario.Usuario || usuario.usuario || "",
    email: usuario.Email || usuario.email || "",
    telefono: usuario.Celular || usuario.Telefono || usuario.telefono || "",
    documento: usuario.Documento || usuario.documento || "",
    direccion: usuario.Direccion || usuario.direccion || "",
    rol: usuario.rol || usuario.Rol || "",

    // Datos del cliente
    id_cliente: Id_cliente,
    tipo: usuario.tipo || "",
    estado: usuario.estado || "",
    nivel: usuario.nivel || "Bronce",
    cupoCredito: usuario.cupoCredito || 0,
    compras: usuario.compras || 0,
    totalGastado: usuario.totalGastado || 0,
    observaciones: usuario.observaciones || ""
    };
};

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

    // También repara sesiones creadas antes de que se conservaran los nombres
    // canónicos de los identificadores.
    req.session.usuario = normalizarUsuario(req.session.usuario);

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
const response = await fetch(`${API_URL.usuarios}/${req.session.usuario.id}`, {
    headers: {
        "Authorization": `Bearer ${process.env.BACKEND_SECRET_KEY || "clave_firma_seguridad_bacoapp"}`,
        "x-user-id": String(req.session.usuario.id),
        "x-user-role": String(req.session.usuario.rol || "")
    }
});
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

// controlador vista de ofertas
export const getOfertas = async (req, res) => {

    if (!requiereLogin(req, res)) return;

    try {

        const headers = {
            "Authorization": `Bearer ${process.env.BACKEND_SECRET_KEY || "clave_firma_seguridad_bacoapp"}`,
            "x-user-id": String(req.session.usuario.id),
            "x-user-role": String(req.session.usuario.rol || "admin")
        };

        const [responseOfertas, responseProductos] = await Promise.all([
            fetch(API_URL.ofertas, { headers }),
            fetch(API_URL.productos, { headers })
        ]);

        const ofertas = responseOfertas.ok
            ? await responseOfertas.json()
            : [];

        const productos = responseProductos.ok
            ? await responseProductos.json()
            : [];

        res.render(getPath("../../views/ofertas-admin.ejs"), {
            ofertas,
            productos,
            active: "ofertas"
        });

    } catch (error) {

        console.error("Error cargando ofertas o productos:", error);

        res.render(getPath("../../views/ofertas-admin.ejs"), {
            ofertas: [],
            productos: [],
            active: "ofertas"
        });
    }
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
 export const getClientes = async (req, res)=> {
    try{
        const response = await fetch(API_URL.clientes);
        const clientes = await response.json();

        console.log(clientes);
        res.render (getPath("../../views/clientes.ejs"),{
            clientes
        });
    } catch (error){
        console.error("Error clientes:", error);

        res.render (getPath("../../views/clientes.ejs"),{
            clientes:[]
            
    });
    }
};

//controlador dinamico
//controlador para vista busqueda
export const getBusqueda = async (req, res) => {
    try {
        const response = await fetch(API_URL.productos);

        if (!response.ok) {
            throw new Error("No se pudieron obtener los productos");
        }

        const productos = await response.json();

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
        const categorias = { data: [] };
        res.render(getPath("../../views/categorias.ejs"), { categorias: categorias.data });
    } catch (error) {
        console.error("Datos de categorías no disponibles", error);
        res.render(getPath("../../views/categorias.ejs"));
    }
};

//controlador dinamico
// controlador vista de inicio
export const getInicio = async (req, res) => {

    try {

        const responseProductos =
            await fetch(API_URL.productos);

        const productos =
            await responseProductos.json();

        const responseOfertas =
            await fetch(`${API_URL.ofertas}/activas`);

        const ofertas =
            await responseOfertas.json();

        const responseMasVendidos =
            await fetch(
                `${API_URL.productos}/masvendidos`
            );

        const masVendidos =
            await responseMasVendidos.json();

        res.render("inicio", {
            productos,
            ofertas,
            masVendidos
        });

    } catch (error) {

        console.error(error);

        res.render("inicio", {
            productos: [],
            ofertas: [],
            masVendidos: []
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
const response = await fetch(`${API_URL.usuarios}/${req.session.usuario.id}`, {
    headers: {
        "Authorization": `Bearer ${process.env.BACKEND_SECRET_KEY || "clave_firma_seguridad_bacoapp"}`,
        "x-user-id": String(req.session.usuario.id),
        "x-user-role": String(req.session.usuario.rol || "")
    }
});       
   

        if (!response.ok) { 
            req.destroySession?.();
            return res.redirect("/login");
         }
    
        const usuario = normalizarUsuario(await response.json());
        req.session.usuario = usuario;

        console.log("Usuario:", usuario);
console.log("Id cliente:", usuario.id_cliente);

        // obtener ventas cliente
        const responseVentas = await fetch(
            `${API_URL.ventas}/cliente/${usuario.id_cliente}`
        );

        const ventas = responseVentas.ok
        ? await responseVentas.json()
        : [];

        res.render(getPath("../../views/cuenta.ejs"),
         { usuario,
            ventas
          });
    } catch (error) {
        console.error("Error cuenta:", error);
        res.render(getPath("../../views/cuenta.ejs"), {
            usuario: req.session.usuario,
            ventas: []
        });
    }
};

//controlador de vista vinos
export const getVinos = async (req, res) => {
    try {
        const response = await fetch(`${API_URL.productos}/categoria/Vinos`)
        const vinos = await response.json();

        console.log(vinos);

        res.render(getPath("../../views/vinos.ejs"), {
            vinos
        });

    } catch (error) {
        console.error("Error vinos:", error);

        res.render(getPath("../../views/vinos.ejs"), {
            vinos: []
        });
    }
};

// // Controlador de vista whiskyes

 export const getWhiskys = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Whiskys`);
        const whiskys = await response.json();

        console.log(whiskys);
        res.render (getPath("../../views/whiskys.ejs"),{
            whiskys
        });
    } catch (error){
        console.error("Error whiskys:", error);

        res.render (getPath("../../views/whiskys.ejs"),{
            whiskys:[]
            
    });
    }
};

// Controlador de vista rones

 export const getRones = async (req, res)=> {
    try{
        const response = await fetch( `${API_URL.productos}/categoria/Rones`);
        const rones = await response.json();

        console.log(rones);
        res.render (getPath("../../views/rones.ejs"),{
            rones
        });
    } catch (error){
        console.error("Error ron:", error);

        res.render (getPath("../../views/rones.ejs"),{
            rones:[]
            
    });
    }
};

// controlador de vista para cervezas

 export const getCervezas = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Cervezas`);
        const cervezas = await response.json();

        console.log(cervezas);
        res.render (getPath("../../views/cervezas.ejs"),{
            cervezas
        });
    } catch (error){
        console.error("Error cervezas:", error);

        res.render (getPath("../../views/cervezas.ejs"),{
            cervezas:[]
            
    });
    }
};

// controlador de vista tequilas
 export const getTequilas = async (req, res)=> {
    try{
        const response = await fetch (`${API_URL.productos}/categoria/Tequilas`);
        const tequilas = await response.json();

        console.log(tequilas);
        res.render (getPath("../../views/tequilas.ejs"),{
            tequilas
        });
    } catch (error){
        console.error("Error tequilas:", error);

        res.render (getPath("../../views/tequilas.ejs"),{
            tequilas:[]
            
    });
    }
};

// controlador de vista aguardientes
 export const getAguardientes = async (req, res)=> {
    try{
        const response = await fetch (`${API_URL.productos}/categoria/Aguardientes`);
        const aguardientes = await response.json();

        console.log(aguardientes);
        res.render (getPath("../../views/aguardientes.ejs"),{
            aguardientes
        });
    } catch (error){
        console.error("Error aguardientes:", error);

        res.render (getPath("../../views/aguardientes.ejs"),{
            aguardientes:[]
            
    });
    }
};

// vista controlador gaseosas

 export const getGaseosas = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Gaseosas`);
        const gaseosas = await response.json();

        console.log(gaseosas);
        res.render (getPath("../../views/gaseosas.ejs"),{
            gaseosas
        });
    } catch (error){
        console.error("Error gaseosas:", error);

        res.render (getPath("../../views/gaseosas.ejs"),{
            gaseosas:[]
            
    });
    }
};

// controlador vista de jugos
 export const getJugos = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Jugos`);
        const jugos = await response.json();

        console.log(jugos);
        res.render (getPath("../../views/jugos.ejs"),{
            jugos
        });
    } catch (error){
        console.error("Error jugos:", error);

        res.render (getPath("../../views/jugos.ejs"),{
            jugos:[]
            
    });
    }
};

// controlador vista de vodkas
 export const getVodkas = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Vodkas`);
        const vodkas = await response.json();

        console.log(vodkas);
        res.render (getPath("../../views/vodkas.ejs"),{
            vodkas
        });
    } catch (error){
        console.error("Error vodkas:", error);

        res.render (getPath("../../views/vodkas.ejs"),{
            vodkas:[]
            
    });
    }
};


// controlador vista de ginebras
 export const getGinebras = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Ginebras`);
        const ginebras = await response.json();

        console.log(ginebras);
        res.render (getPath("../../views/ginebras.ejs"),{
            ginebras
        });
    } catch (error){
        console.error("Error ginebras:", error);

        res.render (getPath("../../views/ginebras.ejs"),{
            ginebras:[]
            
    });
    }
};

// controlador vista de desechables
 export const getDesechables = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Desechables`);
        const desechables = await response.json();

        console.log(desechables);
        res.render (getPath("../../views/desechables.ejs"),{
            desechables
        });
    } catch (error){
        console.error("Error desechables:", error);

        res.render (getPath("../../views/desechables.ejs"),{
            desechables:[]
            
    });
    }
};

// controlador vista de dulces
 export const getDulces = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Dulces`);
        const dulces = await response.json();

        console.log(dulces);
        res.render (getPath("../../views/dulces.ejs"),{
            dulces
        });
    } catch (error){
        console.error("Error dulces:", error);

        res.render (getPath("../../views/dulces.ejs"),{
            dulces:[]
            
    });
    }
};

// controlador vista de accesorios
 export const getAccesorios = async (req, res)=> {
    try{
        const response = await fetch(`${API_URL.productos}/categoria/Accesorios`);
        const accesorios = await response.json();

        console.log(accesorios);
        res.render (getPath("../../views/accesorios.ejs"),{
            accesorios
        });
    } catch (error){
        console.error("Error accesorios:", error);

        res.render (getPath("../../views/accesorios.ejs"),{
            accesorios:[]
            
    });
    }
};

// controlador de vista reset

 export const getReset = (req, res) => {

    const { token } = req.params;

    res.render(getPath("../../views/reset-password.ejs"), {
        token,
        error: null,
        success: null
    });

};


// controlador de mercado pago

export const getPagoExitoso = (req, res) => {
    res.render("pago-exitoso");
};

export const getPagoFallido = (req, res) => {
    res.render("pago-fallido");
};

export const getPagoPendiente = (req, res) => {
    res.render("pago-pendiente");
};

// controlador vista de gestion productos
export const getGestionProductos = (req, res) => {
    if (!requiereAdmin(req, res)) return;
    res.render("gestion-productos");
};
