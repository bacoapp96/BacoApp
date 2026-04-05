import { Router } from 'express';
import {
    listarDetallesVenta,  
    obtenerDetallesVenta,
    crearDetallesVenta,
    actualizarDetallesVenta,
    eliminarDetallesVenta
} from '../controllers/controller.detalle_venta.js';

const router = Router();

router.get('/', listarDetallesVenta);
router.get('/:id', obtenerDetallesVenta);
router.post('/', crearDetallesVenta);
router.put('/:id', actualizarDetallesVenta);
router.delete('/:id', eliminarDetallesVenta);

export default router;