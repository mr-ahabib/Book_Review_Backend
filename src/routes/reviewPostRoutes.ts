import { Router } from 'express';
import { createReviewPost } from '../controllers/reviewPostController';
import { authenticate } from '../middleware/auth';
import upload from '../middleware/multer';
const router = Router();
router.post('/create-review-post', authenticate, upload.single('coverUrl'), createReviewPost);

export default router;