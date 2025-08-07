import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/signup', signup);
router.post('/login', login);

export default router;