import { Router } from "express";
import {
    listarClientes,
    obtenerCliente,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} from '../controllers/controller.cliente.js';

const router = Router();

//RUTAS CORRECTAS
router.get('/', listarClientes);
router.get('/:id', obtenerCliente);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;