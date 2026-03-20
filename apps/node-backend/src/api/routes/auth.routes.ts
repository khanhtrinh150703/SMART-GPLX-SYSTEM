import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.signUp);
router.post('/login', AuthController.login)

export default router;