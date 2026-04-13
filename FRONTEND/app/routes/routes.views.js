import {Router} from "express";
import {    getIndex,
            getLogin,
            getTienda,
            getBusqueda,
            getRegistro,
            getRegistroAdmin,
            getCategoria,
            getInicio,
            getAdministrador
         } from "../controller/controller.views.js";


const router = Router();

router.get("/Index", getIndex);
router.get("/Login", getLogin);
router.get("/Tienda", getTienda);
router.get("/Busqueda", getBusqueda);
router.get("/Registro", getRegistro);
router.get("/RegistroAdmin", getRegistroAdmin);
router.get("/Categorias", getCategoria);
router.get("/Inicio", getInicio);
router.get("/Administrador", getAdministrador);
   

export default router;