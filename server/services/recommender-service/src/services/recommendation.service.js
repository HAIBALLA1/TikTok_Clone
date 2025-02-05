import redis from '../config/redis.js';
import { publishMessage } from '../amqplib.service.mjs';

/**
 * Increment the score of a video in the sorted set associated with the user's email.
 */
export async function updateUserRecommendation(email, videoId, scoreDelta) {
  await redis.zincrby(`recommendations:${email}`, scoreDelta, videoId);
}

/**
 * Get the recommendations based on the interaction scores for a user identified by email.
 */
export async function getUserRecommendations(email, top = 10) {
  // get the videos with their scores, sorted by descending order
  const recs = await redis.zrevrange(`recommendations:${email}`, 0, top - 1, 'WITHSCORES');
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
  // For now, just return a dummy score of 1.
  return 1;
}

/**
 * Calculate the hybrid recommendations by combining the interaction score and the content score.
 * This function will now use the user's email.
 */
export async function getHybridRecommendations(email) {
  const interactionRecs = await getUserRecommendations(email, 10);  // Use email instead of userId
  const alpha = 0.7; // weight for the interaction score
  const beta = 0.3;  // weight for the content score

  // Combine interaction and content scores for each video
  const hybrid = await Promise.all(interactionRecs.map(async (rec) => {
    const contentScore = await getContentScoreForVideo(rec.videoId);
    const combinedScore = alpha * rec.score + beta * contentScore;
    return { videoId: rec.videoId, combinedScore };
  }));

  // Sort by combined score in descending order
  hybrid.sort((a, b) => b.combinedScore - a.combinedScore);
  return hybrid;
}

/**
 * Update the recommendation score based on an interaction.
 * - like   : +3 points
 * - watch  : +1 point (or +2 if watchTime > 30 seconds)
 * - share  : +2 points
 * This function now uses email instead of userId.
 */
export async function updateRecommendationWithInteraction(interaction) {
  const { email, videoId, actionType, watchTime } = interaction;  // Use email
  if (!email || !videoId || !actionType) return;

  let scoreDelta = 0;
  if (actionType === 'like') {
    scoreDelta = 3;
  } else if (actionType === 'watch') {
    scoreDelta = watchTime > 30 ? 2 : 1;
  } else if (actionType === 'share') {
    scoreDelta = 2;
  }

  await updateUserRecommendation(email, videoId, scoreDelta);
  console.log(`[Recommendation] Score updated for user ${email}, video ${videoId} by ${scoreDelta} points`);
}
