import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoutes from './routes/user.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Récupère la variable d'environnement injectée par Docker
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/users', userRoutes);
app.get('/', (req, res) => res.send('Hello from user-service'));

const PORT = process.env.USER_SERVICE_PORT || 3001;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
