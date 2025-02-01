// Stocking the recommendations in memory
const userRecommendations = {};

/**
 * Update the scores based on the interaction.
 * - like   : +3 points
 * - watch  : +1 point (or +2 if watchTime > 30 seconds)
 * - share  : +2 points
 */
export function updateRecommendationWithInteraction(interaction) {
  const { userId, videoId, actionType, watchTime } = interaction;
  if (!userId || !videoId || !actionType) return;

  if (!userRecommendations[userId]) {
    userRecommendations[userId] = {};
  }
  if (!userRecommendations[userId][videoId]) {
    userRecommendations[userId][videoId] = 0;
  }

  switch (actionType) {
    case 'like':
      userRecommendations[userId][videoId] += 3;
      break;
    case 'watch':
      userRecommendations[userId][videoId] += (watchTime > 30 ? 2 : 1);
      break;
    case 'share':
      userRecommendations[userId][videoId] += 2;
      break;
    default:
      break;
  }

  console.log(
    `[Recommandation] Score updated for user ${userId} and video ${videoId} : ${userRecommendations[userId][videoId]}`
  );
}

/**
 * Return the recommended videos for a user.
 * The videos are sorted by score in descending order.
 */
export function getRecommendationsForUser(userId) {
  const recommendations = userRecommendations[userId];
  if (!recommendations) return [];

  const sorted = Object.entries(recommendations)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([videoId]) => videoId);

  return sorted;
}
