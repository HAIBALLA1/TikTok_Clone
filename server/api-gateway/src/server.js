import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import userProxy from './proxy/userProxy.js';
import videoProxy from './proxy/videoProxy.js';
import recommenderProxy from './proxy/recommenderProxy.js';
import { apiGatewayPort } from './config/config.js';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js'; 

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 100 
}));


app.get('/api', (req, res) => {
    res.json({ message: 'API Gateway is running' });
  });
  
app.use('/api/users/register', userProxy);

app.use('/api/users/login', userProxy); 

app.use('/api/users', authenticateToken, userProxy);

app.use('/api/videos', authenticateToken, (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
    req.headers['x-user-id'] = req.user.id;
    console.log('Headers sent to video-service:', req.headers);
    next();
}, videoProxy);


app.use('/api/recommender', authenticateToken, recommenderProxy);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!'); 
});

app.listen(apiGatewayPort, () => {
    console.log(`API Gateway is running on port ${apiGatewayPort}`);
});