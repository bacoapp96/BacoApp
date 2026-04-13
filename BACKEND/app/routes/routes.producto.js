import { Router } from 'express';
import {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductos,
} from '../controllers/controller.producto.js';

const router = Router();

// CRUD
router.get("/buscar", buscarProductos);
router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);


export default router;