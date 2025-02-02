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
import bodyParser from 'body-parser';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(morgan('dev'));
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(rateLimit({ // Limitation de taux
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api', (req, res) => {
    res.json({ message: 'API Gateway is running' });
  });

app.use((req, res, next) => {
    console.log(`[API Gateway] Requête sortante : ${req.method} ${req.path}`);
    console.log(`[API Gateway] Headers :`, req.headers);
    next();
});

  
app.use('/api/users/register', userProxy);

app.use('/api/users/login', userProxy); 

app.use('/api/users', authenticateToken, userProxy); 
app.use('/api/videos', (req, res, next) => {
    const user = req.user; // Verify if the authenticateToken middleware has set req.user
    if (user) {
        req.headers['x-user-id'] = user.id; // Add the user ID to the headers
        console.log('Headers sent to video-service:', req.headers);
    } else {
        console.error('User not authenticated, cannot forward x-user-id');
    }
    next();
}, videoProxy);

app.use('/api/recommender', recommenderProxy);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!'); // Error message
});

// Start the server
app.listen(apiGatewayPort, () => {
    console.log(`API Gateway is running on port ${apiGatewayPort}`);
});