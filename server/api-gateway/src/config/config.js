   import dotenv from 'dotenv';

   dotenv.config();

   export const apiGatewayPort = process.env.API_GATEWAY_PORT || 3000;
   export const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3001';
   export const videoServiceUrl = process.env.VIDEO_SERVICE_URL || 'http://video-service:3002';
   export const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3003';
   export const socialServiceUrl = process.env.SOCIAL_SERVICE_URL || 'http://social-service:3004';
   export const recommenderServiceUrl = process.env.RECOMMENDER_SERVICE_URL || 'http://recommender-service:3005';
   export const processingServiceUrl = process.env.PROCESSING_SERVICE_URL || 'http://processing-service:3006';