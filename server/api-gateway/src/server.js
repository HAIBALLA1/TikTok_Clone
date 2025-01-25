import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import userProxy from './proxy/userProxy.js';
import videoProxy from './proxy/videoProxy.js';
import notificationProxy from './proxy/notificationProxy.js';
import socialProxy from './proxy/socialProxy.js';
import recommenderProxy from './proxy/recommenderProxy.js';
import processingProxy from './proxy/processingProxy.js';
import { apiGatewayPort } from './config/config.js';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js'; 

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(rateLimit({ // Limitation de taux
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 
}));

app.use('/api/users/login', userProxy); 
app.use('/api/users/register', userProxy); 

app.use('/api/users', authenticateToken, userProxy);

//app.use('/api/users/register', userProxy);
//app.use('/api/users', authenticateToken, userProxy); 
app.use('/api/videos', videoProxy);
app.use('/api/notifications', notificationProxy);
app.use('/api/social', socialProxy);
app.use('/api/recommender', recommenderProxy);
app.use('/api/processing', processingProxy);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!'); // Error message
});

// Start the server
app.listen(apiGatewayPort, () => {
    console.log(`API Gateway is running on port ${apiGatewayPort}`);
});