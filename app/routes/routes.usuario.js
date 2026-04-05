import { Router } from "express";
import {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from '../controllers/controller.usuario.js';

const router = Router();

router.get('/usuarios', listarUsuarios);
router.get('/usuarios/:id', obtenerUsuario);
router.post('/usuarios', crearUsuario);
router.put('/usuarios/:id', actualizarUsuario);
router.delete('/usuarios/:id', eliminarUsuario);

export default router;