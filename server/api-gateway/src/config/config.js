// /server/api-gateway/src/config/config.js
import dotenv from 'dotenv';
dotenv.config();

module.exports = {
    apiGatewayPort: process.env.API_GATEWAY_PORT ,
    userServiceUrl: process.env.USER_SERVICE_URL ,
    videoServiceUrl: process.env.VIDEO_SERVICE_URL ,
    notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL ,
    socialServiceUrl: process.env.SOCIAL_SERVICE_URL ,
    recommenderServiceUrl: process.env.RECOMMENDER_SERVICE_URL ,
    processingServiceUrl: process.env.PROCESSING_SERVICE_URL ,
};