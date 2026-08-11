import { Router } from "express";
import {
    getOfertas,
    getOferta,
    getEstadisticas,
    getOfertasActivas,
    postOferta,
    putOferta,
    deleteOferta
} from "../controllers/controller.ofertas.js";

import { verificarFirmaFrontend, requiereAdmin } from '../middleware/auth.js';

const router = Router();

router.get("/", verificarFirmaFrontend, requiereAdmin, getOfertas);

router.get("/estadisticas", verificarFirmaFrontend, requiereAdmin, getEstadisticas);

router.get("/activas", getOfertasActivas);

router.get("/:id", verificarFirmaFrontend, requiereAdmin, getOferta);

router.post("/", verificarFirmaFrontend, requiereAdmin, postOferta);

router.put("/:id", verificarFirmaFrontend, requiereAdmin, putOferta);

router.delete("/:id", verificarFirmaFrontend, requiereAdmin, deleteOferta);

export default router;