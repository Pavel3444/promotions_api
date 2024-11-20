import express from 'express';
import { login, register, refresh } from '../controllers/authController';
import {notFoundMiddleware} from "../middlewares/notFoundMiddleware";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.use(notFoundMiddleware('/auth'));

export default router;
