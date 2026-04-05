import { Router } from "express";
import {
    listarClientes,
    obtenerCliente,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} from '../controllers/controller.cliente.js';

const router = Router();

router.get('/clientes', listarClientes);
router.get('/clientes/:id', obtenerCliente);
router.post('/clientes', crearCliente);
router.put('/clientes/:id', actualizarCliente);
router.delete('/clientes/:id', eliminarCliente);

export default router;