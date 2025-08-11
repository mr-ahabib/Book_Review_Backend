import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { voteOnReview , countVotesByReviewId} from '../controllers/voteController';
const router = Router();
router.post('/vote/:reviewId', authenticate, voteOnReview);
router.get('/vote/count/:reviewId',authenticate, countVotesByReviewId);
export default router;