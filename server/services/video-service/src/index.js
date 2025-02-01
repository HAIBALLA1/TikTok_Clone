import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import videoRoutes from './routes/video.routes.js';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Serve static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Define routes for videos
app.use('/api/videos', videoRoutes);

// Configure body-parser for multipart/form-data requests (useful for uploads)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Video service port
const PORT = process.env.VIDEO_SERVICE_PORT || 3002;

// Start server after database synchronization
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Video service running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error connecting to the database:', error);
});
