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

const router = Router();

router.get('/', listarVentas);
router.get('/mes', obtenerVentasMes);
router.get('/productos-vendidos-mes',obtenerProductosVendidosMes);
router.get('/producto-top-mes',obtenerProductoTopMes);
router.get('/mejor-vendedor-mes',obtenerMejorVendedorMes);
router.get("/producto-top-semanal",obtenerProductoTopSemanal);
router.get('/semana', obtenerVentasSemanales);
router.get('/ultimas', obtenerUltimasVentas);
router.get("/detalle/:id", obtenerDetalleVenta);
router.get("/cliente/:id", obtenerVentasCliente);
router.get('/:id', obtenerVenta);

router.post('/', crearVenta);
router.put('/:id', actualizarVenta);
router.delete('/:id', eliminarVenta);

export default router;