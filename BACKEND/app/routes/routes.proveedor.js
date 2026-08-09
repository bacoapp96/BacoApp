import { Router } from "express";

import {
    listarProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} from "../controllers/controller.proveedor.js";

const router = Router();

// LISTAR
router.get("/", listarProveedores);

// OBTENER UNO
router.get("/:id", obtenerProveedor);

// CREAR
router.post("/", crearProveedor);

// ACTUALIZAR
router.put("/:id", actualizarProveedor);

// ELIMINAR
router.delete("/:id", eliminarProveedor);

export default router;