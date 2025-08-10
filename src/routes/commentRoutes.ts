import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createComment, getCommentsByReviewId,countCommentsByReviewId} from '../controllers/commentController';
const router = Router();
router.post('/create-comment/:reviewId', authenticate, createComment);
router.get('/comments/:reviewId',authenticate, getCommentsByReviewId);
router.get('/count-comments/:reviewId',authenticate, countCommentsByReviewId);
export default router;