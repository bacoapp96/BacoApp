import { Router } from "express";
import {
    getIndex,
    getLogin,
    getTienda,
    getBusqueda,
    getRegistro,
    getCarrito,
    getCategoria,
    getInicio,
    getAdministrador,
    getCuenta,
    getClientes,
    getRecovery,
    getInventario,
    getReportes,
    getProveedores,
    getConfiguracion,
    getDashboard,
    getRegistroAdmin,
    getAyuda,
    getCuentaAdmin,
    postLogin,
    putCuenta,
    postLogout,
    postAdministrador,
    getSession,
    getVinos,
    getWhiskys,
    getRones,
    getCervezas,
    getTequilas,
    getAguardientes,
    getGaseosas,
    getJugos,
    getVodkas,
    getGinebras,
    getDesechables,
    getDulces,
    getAccesorios,
    getReset,
    getOfertas,
    getPagoExitoso,
    getPagoFallido,
    getPagoPendiente,
    getGestionProductos
} from "../controller/controller.views.js";


const router = Router();

router.post("/api/login", postLogin);
router.put("/api/cuenta", putCuenta);
router.post("/api/administradores", postAdministrador);
router.post("/api/logout", postLogout);
router.get("/api/session", getSession);
router.get("/api/vinos", getVinos);
router.get("/app/whiskys", getWhiskys);
router.get("/app/rones", getRones);
router.get("/app/cervezas", getCervezas);
router.get("/app/tequilas", getTequilas);
router.get("/app/aguardientes", getAguardientes);
router.get("/app/clientes", getClientes);
router.get("/app/gaseosas", getGaseosas);
router.get("/app/jugos", getJugos);
router.get("/app/vodkas", getVodkas);
router.get("/app/ginebras", getGinebras);
router.get("/app/desechables", getDesechables);
router.get("/app/dulces", getDulces);
router.get("/app/accesorios", getAccesorios);
router.get("/app/reset", getReset);
router.get("/reset-password/:token", getReset);
router.get("/pago-exitoso", getPagoExitoso);
router.get("/pago-fallido", getPagoFallido);
router.get("/pago-pendiente", getPagoPendiente);
router.get("/gestion-productos", getGestionProductos);

const viewRoutes = [
    ["/index", getIndex],
    ["/login", getLogin],
    ["/tienda", getTienda],
    ["/carrito", getCarrito],
    ["/busqueda", getBusqueda],
    ["/registro", getRegistro],
    ["/registroadmin", getRegistroAdmin],
    ["/categorias", getCategoria],
    ["/inicio", getInicio],
    ["/administrador", getAdministrador],
    ["/cuenta", getCuenta],
    ["/cuenta-admin", getCuentaAdmin],
    ["/clientes", getClientes],
    ["/recovery", getRecovery],
    ["/inventario", getInventario],
    ["/reportes", getReportes],
    ["/proveedores", getProveedores],
    ["/configuracion", getConfiguracion],
    ["/dashboard", getDashboard],
    ["/ayuda", getAyuda],
    ["/vinos", getVinos],
    ["/whiskys", getWhiskys],
    ["/rones", getRones],
    ["/cervezas", getCervezas],
    ["/tequilas", getTequilas],
    ["/aguardientes", getAguardientes],
    ["/gaseosas", getGaseosas],
    ["/jugos", getJugos],
    ["/vodkas", getVodkas],
    ["/ginebras", getGinebras],
    ["/desechables", getDesechables],
    ["/dulces", getDulces],
    ["/accesorios", getAccesorios],
    ["/reset", getReset],
    ["/ofertas", getOfertas],
    
];

viewRoutes.forEach(([path, controller]) => {
    router.get(path, controller);
});


export default router;
