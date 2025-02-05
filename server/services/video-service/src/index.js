import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import videoRoutes from './routes/video.routes.js';
import  sequelize  from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT||3002 ;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1gb' })); // Permet des fichiers jusqu'à 1 Go
app.use(express.urlencoded({ extended: true, limit: '1gb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Headers:`, req.headers);
  console.log(`[${req.method}] ${req.url} - Body:`, req.body);
  next();
});


// Routes
app.use('/api/videos', videoRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Video service is up and running!' });
});


sequelize.sync()
  .then(() => console.log('✅ Database connected & synchronized'))
  .catch((err) => console.error('❌ Database connection error:', err));


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
