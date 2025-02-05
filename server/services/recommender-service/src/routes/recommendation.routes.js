import express from 'express';
import { getUserRecommendations } from '../controllers/recommendation.controller.js';

const router = express.Router();

router.get('/:email', getUserRecommendations);

export default router;
