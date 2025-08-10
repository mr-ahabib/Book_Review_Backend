import { Router } from 'express';
import { signup, login, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', authenticate, changePassword);
export default router;