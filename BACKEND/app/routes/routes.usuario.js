import { Router } from "express";
import {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    crearAdministrador,
    actualizarUsuario,
    eliminarUsuario,
    login
} from '../controllers/controller.usuario.js';

const router = Router();

// CRUD
router.get('/', listarUsuarios);
router.post('/login', login);
router.post('/admin', crearAdministrador);
router.get('/:id', obtenerUsuario);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;
