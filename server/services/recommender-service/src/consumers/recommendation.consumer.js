import amqp from 'amqplib';
import { updateRecommendationWithInteraction } from '../services/recommendation.service.js';

async function initRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // Déclaration de l'exchange (type topic)
  await channel.assertExchange('interactions_exchange', 'topic', { durable: false });
  // Déclaration de la file dédiée aux recommandations
  await channel.assertQueue('recommendation_queue', { durable: false });
  // Liaison de la file à l'exchange pour recevoir les messages avec la clé 'interaction.new'
  await channel.bindQueue('recommendation_queue', 'interactions_exchange', 'interaction.new');

  console.log('[AMQP][Recommandation] Exchange et queue configurés');
  return channel;
}

export async function startRecommendationConsumer() {
  const channel = await initRabbitMQ();
  channel.consume(
    'recommendation_queue',
    (msg) => {
      if (msg !== null) {
        const interaction = JSON.parse(msg.content.toString());
        console.log('[Recommandation] Interaction reçue :', interaction);
        // Mise à jour de la logique de recommandation
        updateRecommendationWithInteraction(interaction);
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
  console.log('[AMQP][Recommandation] En écoute sur recommendation_queue');
}
