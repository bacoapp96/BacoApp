import { Router } from "express";
import {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    login
} from '../controllers/controller.usuario.js';

const router = Router();

// CRUD
router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuario);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

//LOGIN API
router.post('/login', login);

export default router;