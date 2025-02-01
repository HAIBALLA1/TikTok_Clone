import express from 'express';
import { getUserRecommendations } from '../controllers/recommendation.controller.js';

const router = express.Router();

// GET /api/recommendations/:userId
router.get('/:userId', getUserRecommendations);

export default router;
