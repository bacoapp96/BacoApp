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
    getCliente,
    getRecovery,
    getInventario,
    getReportes,
    getProveedores,
    getConfiguracion,
    getDashboard,
    getRegistroAdmin,
    getAyuda,
    getCuentaAdmin
    
} from "../controller/controller.views.js";


const router = Router();

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
    ["/cliente", getCliente],
    ["/recovery", getRecovery],
    ["/inventario", getInventario],
    ["/reportes", getReportes],
    ["/proveedores", getProveedores],
    ["/configuracion", getConfiguracion],
    ["/dashboard", getDashboard],
    ["/ayuda", getAyuda]
];

viewRoutes.forEach(([path, controller]) => {
    router.get(path, controller);
});


export default router;
