import { Router } from "express";
import {
    listarVentas,
    obtenerVenta,
    obtenerDetalleVenta,
    obtenerVentasCliente,
    crearVenta,
    actualizarVenta,
    eliminarVenta,
    obtenerVentasMes,
    obtenerProductosVendidosMes,
    obtenerProductoTopMes,
    obtenerMejorVendedorMes,
    obtenerProductoTopSemanal,
    obtenerVentasSemanales,
    obtenerUltimasVentas,
   
} from '../controllers/controller.venta.js';

import { verificarFirmaFrontend, requiereAdmin, requiereUsuarioLogueado } from '../middleware/auth.js';

const router = Router();

router.get('/', verificarFirmaFrontend, requiereAdmin, listarVentas);
router.get('/mes', verificarFirmaFrontend, requiereAdmin, obtenerVentasMes);
router.get('/productos-vendidos-mes', verificarFirmaFrontend, requiereAdmin, obtenerProductosVendidosMes);
router.get('/producto-top-mes', verificarFirmaFrontend, requiereAdmin, obtenerProductoTopMes);
router.get('/mejor-vendedor-mes', verificarFirmaFrontend, requiereAdmin, obtenerMejorVendedorMes);
router.get("/producto-top-semanal", verificarFirmaFrontend, requiereAdmin, obtenerProductoTopSemanal);
router.get('/semana', verificarFirmaFrontend, requiereAdmin, obtenerVentasSemanales);
router.get('/ultimas', verificarFirmaFrontend, requiereAdmin, obtenerUltimasVentas);
router.get("/detalle/:id", verificarFirmaFrontend, requiereAdmin, obtenerDetalleVenta);
router.get("/cliente/:id", verificarFirmaFrontend, requiereUsuarioLogueado, obtenerVentasCliente);
router.get('/:id', verificarFirmaFrontend, requiereAdmin, obtenerVenta);

router.post('/', verificarFirmaFrontend, requiereUsuarioLogueado, crearVenta);
router.put('/:id', verificarFirmaFrontend, requiereAdmin, actualizarVenta);
router.delete('/:id', verificarFirmaFrontend, requiereAdmin, eliminarVenta);

export default router;