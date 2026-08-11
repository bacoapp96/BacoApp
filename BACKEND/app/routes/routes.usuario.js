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

import { verificarFirmaFrontend, requiereAdmin, requiereUsuarioLogueado } from '../middleware/auth.js';

const router = Router();

// CRUD
router.get('/', verificarFirmaFrontend, requiereAdmin, listarUsuarios);
router.post('/login', login);
router.post('/admin', verificarFirmaFrontend, requiereAdmin, crearAdministrador);
router.get('/:id', verificarFirmaFrontend, requiereUsuarioLogueado, obtenerUsuario);
router.post('/', crearUsuario);
router.put('/:id', verificarFirmaFrontend, requiereUsuarioLogueado, actualizarUsuario);
router.delete('/:id', verificarFirmaFrontend, requiereAdmin, eliminarUsuario);

export default router;
