import { Router } from "express";
import { getIndex, getLogin} from '../controllers/controller.views.js';

const router = Router();

router.get('/index', getIndex);
router.get('/login', getLogin);




export default router;