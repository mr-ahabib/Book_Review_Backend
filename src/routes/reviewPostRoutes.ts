import { Router } from 'express';
import { createReviewPost, getTopReview } from '../controllers/reviewPostController';
import { authenticate } from '../middleware/auth';
import upload from '../middleware/multer';
const router = Router();
router.post('/create-review-post', authenticate, upload.single('coverUrl'), createReviewPost);
router.get('/reviews/top', authenticate, getTopReview);
export default router;