import { consumeMessage, publishMessage } from '../amqplib.service.mjs';
import { updateRecommendationWithInteraction } from '../services/recommendation.service.js';

/**
 * Start the recommendation consumer.
 */
export async function startRecommendationConsumer() {
  console.log('[AMQP][Recommandation] Initialization of the consumer...');

  await consumeMessage('recommendation_queue', (msg) => {
    console.log('[Recommandation] Received interaction :', msg);
    updateRecommendationWithInteraction(msg);
  });

  console.log('[AMQP][Recommandation] Waiting for messages...');
}
