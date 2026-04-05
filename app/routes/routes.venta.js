import { Router } from "express";
import {
    listarVentas,
    obtenerVenta,
    crearVenta,
    actualizarVenta,
    eliminarVenta
} from '../controllers/controller.venta.js';

const router = Router();

router.get('/ventas', listarVentas);
router.get('/ventas/:id', obtenerVenta);
router.post('/ventas', crearVenta);
router.put('/ventas/:id', actualizarVenta);
router.delete('/ventas/:id', eliminarVenta);

export default router;