import { Router } from "express";

import {
    crearPagoWompi,
    confirmarPagoWompi,
    webhookWompi
} from "../controllers/controller.wompi.js";

const router = Router();

router.post("/crear", crearPagoWompi);
router.post("/confirmar", confirmarPagoWompi);
router.post("/webhook", webhookWompi);

export default router;