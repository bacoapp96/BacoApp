import {Router} from "express";
import {listarUsuarios,
        obtenerUsuario,
        crearUsiario,
        actualiceUsuario,
        elimineUsuario,
} from "../../../controller.usuario.js"; 

const router = Router();

router.get("/usuario", listarUsuarios);
router.get("/usuario1", obtenerUsuario);
router.post("/usuario2", crearUsiario);
router.put("/usuario3", actualiceUsuario);
router.delete("/usuario4", elimineUsuario);

export default router;