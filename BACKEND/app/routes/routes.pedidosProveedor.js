import { Router } from "express";

import {
    listarPedidosProveedor,
    obtenerPedidoProveedor,
    crearPedidoProveedor,
    cancelarPedidoProveedor
} from "../controllers/controller.pedidosProveedor.js";

const router = Router();

// LISTAR PEDIDOS
router.get("/", listarPedidosProveedor);

// OBTENER UN PEDIDO CON SUS PRODUCTOS
router.get("/:id", obtenerPedidoProveedor);

// CREAR PEDIDO
router.post("/", crearPedidoProveedor);

// CANCELAR PEDIDO
router.put("/:id/cancelar", cancelarPedidoProveedor);

export default router;