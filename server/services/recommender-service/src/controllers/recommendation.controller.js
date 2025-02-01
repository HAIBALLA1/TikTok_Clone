import { getRecommendationsForUser } from '../services/recommendation.service.js';

export function getUserRecommendations(req, res) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }

  const recommendations = getRecommendationsForUser(userId);
  res.json({ userId, recommendations });
}
