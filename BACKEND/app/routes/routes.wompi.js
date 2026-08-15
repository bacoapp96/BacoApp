import { Router } from "express";

import {
    crearPagoWompi,
    confirmarPagoWompi
} from "../controllers/controller.wompi.js";

const router = Router();

router.post("/crear", crearPagoWompi);
router.post("/confirmar", confirmarPagoWompi);

export default router;