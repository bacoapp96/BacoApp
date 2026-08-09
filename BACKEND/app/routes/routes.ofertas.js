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

const router = Router();

router.get("/", getOfertas);

router.get("/estadisticas", getEstadisticas);

router.get("/activas", getOfertasActivas);

router.get("/:id", getOferta);

router.post("/", postOferta);

router.put("/:id", putOferta);

router.delete("/:id", deleteOferta);

export default router;