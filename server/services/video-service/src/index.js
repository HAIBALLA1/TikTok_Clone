import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import videoRoutes from './routes/video.routes.js';
import { sequelize } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/videos', videoRoutes);

// Connexion à la base de données
sequelize.sync()
  .then(() => console.log('✅ Database connected & synchronized'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
