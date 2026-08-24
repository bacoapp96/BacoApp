import { Router } from "express";

import {
    listarPedidosProveedor,
    obtenerPedidoProveedor,
    crearPedidoProveedor,
    cancelarPedidoProveedor,
    recibirPedidoProveedor
} from "../controllers/controller.pedidosProveedor.js";

const router = Router();

// LISTAR PEDIDOS
router.get("/", listarPedidosProveedor);

// OBTENER UN PEDIDO CON SUS PRODUCTOS
router.get("/:id", obtenerPedidoProveedor);

// CREAR PEDIDO
router.post("/", crearPedidoProveedor);

//Recibir pedido
router.put("/:id/recibir",recibirPedidoProveedor);

// CANCELAR PEDIDO
router.put("/:id/cancelar", cancelarPedidoProveedor);

export default router;