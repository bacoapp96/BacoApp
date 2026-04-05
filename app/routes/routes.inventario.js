import { Router } from "express";
import {
    listarInventario,
    obtenerInventario,
    crearInventario,
    actualizarInventario,
    eliminarInventario
} from '../controllers/controller.inventario.js';

const router = Router();

router.get('/inventario', listarInventario);
router.get('/inventario/:id', obtenerInventario);
router.post('/inventario', crearInventario);
router.put('/inventario/:id', actualizarInventario);
router.delete('/inventario/:id', eliminarInventario);

export default router;