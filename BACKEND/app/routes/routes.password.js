import express from "express";
import {
    forgotPassword,
    verificarToken,
    cambiaPassword
} from "../controllers/controller.password.js";

const router = express.Router();

router.post("/forgot", forgotPassword);

router.get("/reset-password/:token", verificarToken);

router.post("/reset-password/:token", cambiaPassword);

export default router;