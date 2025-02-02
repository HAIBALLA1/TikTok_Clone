import { getHybridRecommendations } from '../services/recommendation.service.js';

export async function getUserRecommendations(req, res) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }
  try {
    const recommendations = await getHybridRecommendations(userId);
    res.json({ userId, recommendations });
  } catch (error) {
    console.error('Error retrieving recommendations:', error);
    res.status(500).json({ error: 'Error retrieving recommendations' });
  }
}
