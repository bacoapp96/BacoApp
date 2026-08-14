import { Router } from "express";

import {
    crearPagoWompi
} from "../controllers/controller.wompi.js";

const router = Router();

router.post("/crear", crearPagoWompi);

export default router;