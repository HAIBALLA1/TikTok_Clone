   import dotenv from 'dotenv';

   dotenv.config();

   export const apiGatewayPort = process.env.API_GATEWAY_PORT;
   export const userServiceUrl = process.env.USER_SERVICE_URL ;
   export const videoServiceUrl = process.env.VIDEO_SERVICE_URL ;
   export const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL ;
   export const socialServiceUrl = process.env.SOCIAL_SERVICE_URL ;
   export const recommenderServiceUrl = process.env.RECOMMENDER_SERVICE_URL ;
   export const processingServiceUrl = process.env.PROCESSING_SERVICE_URL ;