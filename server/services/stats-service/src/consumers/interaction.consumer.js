import { consumeMessage } from '../../../amqplib.service.js';
import UserInteraction from '../models/stats-model.js';

export async function startInteractionConsumer() {
  await consumeMessage('stats_queue', async (msg) => {
    console.log('[StatsService] Received interaction:', msg);

    try {
      await UserInteraction.create({
        userId: msg.userId,
        videoId: msg.videoId,
        actionType: msg.actionType,
        watchTime: msg.watchTime ?? 0,
        createdAt: new Date()
      });
      console.log('[StatsService] Interaction stored in DB');
    } catch (error) {
      console.error('[StatsService] Error saving interaction:', error);
    }
  });
}
