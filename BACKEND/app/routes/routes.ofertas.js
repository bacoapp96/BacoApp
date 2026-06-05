import { Router } from "express";
import {
    getOfertas,
    getOferta,
    postOferta,
    putOferta,
    deleteOferta
} from "../controllers/controller.ofertas.js";

const router = Router();

router.get("/", getOfertas);
router.get("/:id", getOferta);
router.post("/", postOferta);
router.put("/:id", putOferta);
router.delete("/:id", deleteOferta);

export default router;