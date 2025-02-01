import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import videoRoutes from './routes/video.routes.js';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors()); // Permettre les requêtes cross-origin
app.use(express.json()); // Pour parser les requêtes JSON

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Définir les routes pour les vidéos
app.use('/api/videos', videoRoutes);

// Configurer body-parser pour les requêtes multipart/form-data (utile pour les uploads)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Port du service vidéo
const PORT = process.env.VIDEO_SERVICE_PORT || 3002;

// Démarrer le serveur après synchronisation avec la base de données
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Video service running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error connecting to the database:', error);
});
