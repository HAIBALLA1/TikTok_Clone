import amqp from 'amqplib';
import { updateRecommendationWithInteraction } from '../services/recommendation.service.js';

async function initRabbitMQ() {

    const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
  const channel = await connection.createChannel();

  // the exchange is of type topic
  await channel.assertExchange('interactions_exchange', 'topic', { durable: false });
  // the queue is dedicated to recommendations
  await channel.assertQueue('recommendation_queue', { durable: false });
  // the queue is bound to the exchange to receive messages with the key 'interaction.new'
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
        // update the recommendation based on the interaction
        updateRecommendationWithInteraction(interaction);
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
  console.log('[AMQP][Recommandation] Listening on recommendation_queue');
}
