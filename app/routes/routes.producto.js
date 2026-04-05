import { Router } from "express";

import {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../controllers/controller.producto.js';

const router = Router();

router.get('/productos', listarProductos);
router.get('/productos/:id', obtenerProducto);
router.post('/productos', crearProducto);
router.put('/productos/:id', actualizarProducto);
router.delete('/productos/:id', eliminarProducto);

export default router;