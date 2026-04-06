import { Router } from "express";
import { getIndex, holaMundo } from '../controllers/controller.views.js';

const router = Router();

router.get('/index', getIndex);
router.get('/holaMundo', holaMundo);


export default router;