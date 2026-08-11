import { Router } from 'express';
import {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductos,
    listarPorCategoria,
    obtenerFiltros,
    obtenerMasVendidos,
    obtenerStockBajo,
    cambiarStock,
} from '../controllers/controller.productos.js';
import { uploadProducto } from "../middleware/multer.productos.js";

const router = Router();

import { verificarFirmaFrontend, requiereAdmin } from '../middleware/auth.js';

// CRUD


router.get("/buscar", buscarProductos);

router.get("/masvendidos", obtenerMasVendidos);

router.get("/filtros/:categoria", obtenerFiltros);

router.get("/categoria/:categoria", listarPorCategoria);

router.get("/stock-bajo", verificarFirmaFrontend, requiereAdmin, obtenerStockBajo);

router.get("/", listarProductos);

router.get("/:id", obtenerProducto);

router.put("/:id/stock", verificarFirmaFrontend, requiereAdmin, cambiarStock);

router.post("/", verificarFirmaFrontend, requiereAdmin, uploadProducto.single("imagen"),
    crearProducto
);

router.put("/:id", verificarFirmaFrontend, requiereAdmin, uploadProducto.single("imagen"), actualizarProducto);

router.delete("/:id", verificarFirmaFrontend, requiereAdmin, eliminarProducto);

export default router;
