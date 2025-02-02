import express from 'express';
import recommendationRoutes from './routes/recommendation.routes.js';
import { startRecommendationConsumer } from './consumers/recommendation.consumer.js';


const app = express();

app.use(express.json());

app.use('/api/recommendations', recommendationRoutes);

startRecommendationConsumer();

const PORT = process.env.RECOMMENDATION_SERVICE_PORT ;
app.listen(PORT, () => {
  console.log(`Recommendation service running on port ${PORT}`);
});
