import { Router } from "express";
import {
    listarInventario,
    obtenerInventario,
    crearInventario,
    actualizarInventario,
    eliminarInventario
} from '../controllers/controller.inventario.js';

const router = Router();

router.get('/', listarInventario);
router.get('/:id', obtenerInventario);
router.post('/', crearInventario);
router.put('/:id', actualizarInventario);
router.delete('/:id', eliminarInventario);

export default router;