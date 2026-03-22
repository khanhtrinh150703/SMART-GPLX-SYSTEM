import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.signUpInit);
router.post('/verify', AuthController.signUpVerify);
router.post('/login', AuthController.login)
router.post('/resend-otp', AuthController.resendOtp)


export default router;