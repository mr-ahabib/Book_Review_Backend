import express from "express";
import authRoutes from './authRoutes';
import reviewPostRoutes from './reviewPostRoutes';
import commentRoutes from './commentRoutes';
import voteRoutes from './voteRoutes';
const router = express.Router();
router.use('/',authRoutes)
router.use('/',reviewPostRoutes)
router.use('/',commentRoutes)
router.use('/',voteRoutes)
export default router;