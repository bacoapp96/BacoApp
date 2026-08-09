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

// CRUD


router.get("/buscar", buscarProductos);

router.get("/masvendidos", obtenerMasVendidos);

router.get("/filtros/:categoria", obtenerFiltros);

router.get("/categoria/:categoria", listarPorCategoria);

router.get("/stock-bajo", obtenerStockBajo);

router.get("/", listarProductos);

router.get("/:id", obtenerProducto);

router.put("/:id/stock", cambiarStock);

router.post("/",uploadProducto.single("imagen"),
    crearProducto
);

router.put("/:id", uploadProducto.single("imagen"), actualizarProducto);

router.delete("/:id", eliminarProducto);

export default router;




