import { getHybridRecommendations } from '../services/recommendation.service.js';


export async function getUserRecommendations(req, res) {
  const { email } = req.params;  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const recommendations = await getHybridRecommendations(email);
    res.json({ email, recommendations });
  } catch (error) {
    console.error('Error retrieving recommendations:', error);
    res.status(500).json({ error: 'Error retrieving recommendations' });
  }
}
