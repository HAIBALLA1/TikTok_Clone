import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import videoRoutes from './routes/video.routes.js';
import path from 'path';

dotenv.config();

const app = express();

// Utiliser express.json() et express.urlencoded() avec une limite appropriée
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Définir les routes
app.use('/api/videos', videoRoutes);

// Démarrer le serveur après synchronisation de la BDD
sequelize.sync({ alter: true })
  .then(() => {
    const PORT = process.env.VIDEO_SERVICE_PORT || 3002;
    app.listen(PORT, () => {
      console.log(`Video service running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });
