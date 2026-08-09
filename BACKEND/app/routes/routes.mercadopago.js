import { Router } from "express";

import {
    crearPreferencia
} from "../controllers/controller.mercadopago.js";

const router = Router();

router.post("/crear-preferencia", crearPreferencia);

export default router;