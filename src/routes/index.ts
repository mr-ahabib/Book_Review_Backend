import express from "express";
import authRoutes from './authRoutes';
import reviewPostRoutes from './reviewPostRoutes';
import commentRoutes from './commentRoutes';
const router = express.Router();
router.use('/',authRoutes)
router.use('/',reviewPostRoutes)
router.use('/',commentRoutes)
export default router;