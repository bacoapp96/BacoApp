import { Router } from "express";
import {
    listarClientes,
    obtenerCliente,
    crearCliente,
    actualizarCliente,
    actualizarClienteAdmin,
    eliminarCliente, 
    pedidosCliente,
    reportarCliente,
    bloquearCliente,
    obtenerClientesNuevosMes
} from '../controllers/controller.cliente.js';

const router = Router();

//RUTAS CORRECTAS
router.get('/', listarClientes);
router.get("/nuevos-mes", obtenerClientesNuevosMes);
router.get("/:id/pedidos", pedidosCliente);
router.post("/:id/reportar", reportarCliente);
router.put("/:id/bloquear", bloquearCliente);
router.get('/:id', obtenerCliente);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.put('/:id/admin', actualizarClienteAdmin);
router.delete('/:id', eliminarCliente);

export default router;