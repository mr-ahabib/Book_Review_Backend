import express from "express";
import authRoutes from './authRoutes';
import reviewPostRoutes from './reviewPostRoutes';
const router = express.Router();
router.use('/',authRoutes)
router.use('/',reviewPostRoutes)

export default router;