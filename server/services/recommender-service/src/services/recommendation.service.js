import redis from '../config/redis.js';
import { publishMessage  } from '../amqplib.service.mjs';


/**
 * Increment the score of a video in the sorted set associated with the user.
 */
export async function updateUserRecommendation(userId, videoId, scoreDelta) {
  // the key used is 'recommendations:{userId}'
  await redis.zincrby(`recommendations:${userId}`, scoreDelta, videoId);
}

/**
 * Get the recommendations based on the interaction scores for a user.
 */
export async function getUserRecommendations(userId, top = 10) {
  // get the videos with their scores, sorted by descending order
  const recs = await redis.zrevrange(`recommendations:${userId}`, 0, top - 1, 'WITHSCORES');
  const result = [];
  for (let i = 0; i < recs.length; i += 2) {
    result.push({ videoId: recs[i], score: parseFloat(recs[i + 1]) });
  }
  return result;
}

/**
 * Placeholder function to get a similarity score based on the content (tags, description, etc.)
 * To improve this algorithm, you can query the video service or use an NLP method.
 */
async function getContentScoreForVideo(videoId) {
  
  return 1;
}

/**
 * Calculate the hybrid recommendations by combining the interaction score and the content score.
 */
export async function getHybridRecommendations(userId) {
  const interactionRecs = await getUserRecommendations(userId, 10);
  const alpha = 0.7; // weight for the interaction
  const beta = 0.3;  // weight for the content

  const hybrid = await Promise.all(interactionRecs.map(async (rec) => {
    const contentScore = await getContentScoreForVideo(rec.videoId);
    const combinedScore = alpha * rec.score + beta * contentScore;
    return { videoId: rec.videoId, combinedScore };
  }));

  // sort by combined score in descending order
  hybrid.sort((a, b) => b.combinedScore - a.combinedScore);
  return hybrid;
}

/**
 * Update the recommendation score based on an interaction.
 * - like   : +3 points
 * - watch  : +1 point (or +2 if watchTime > 30 seconds)
 * - share  : +2 points
 */
export async function updateRecommendationWithInteraction(interaction) {
  const { userId, videoId, actionType, watchTime } = interaction;
  if (!userId || !videoId || !actionType) return;

  let scoreDelta = 0;
  if (actionType === 'like') {
    scoreDelta = 3;
  } else if (actionType === 'watch') {
    scoreDelta = watchTime > 30 ? 2 : 1;
  } else if (actionType === 'share') {
    scoreDelta = 2;
  }
  await updateUserRecommendation(userId, videoId, scoreDelta);
  console.log(`[Recommendation] Score mis à jour pour l'utilisateur ${userId}, vidéo ${videoId} de ${scoreDelta} points`);
}
