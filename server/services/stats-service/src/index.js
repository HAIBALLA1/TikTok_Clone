import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { startInteractionConsumer } from './consumers/interaction.consumer.js';

dotenv.config();

const app = express();
app.use(express.json());

// Tentative de connexion DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log('[StatsService] DB connected');
    // await sequelize.sync({ force: false }); // si tu veux créer la table auto
  } catch (error) {
    console.error('[StatsService] Error connecting to DB:', error);
  }
})();

// Lancement du consumer
startInteractionConsumer()
  .then(() => console.log('[StatsService] RabbitMQ consumer started'))
  .catch(console.error);

// (Optionnel) 
// Soit tu crées un router statsRouter, soit tu vires la ligne suivante si tu n'en as pas besoin
// app.use('/stats', statsRouter);

app.get('/ping', (req, res) => {
  res.json({ message: 'StatsService is alive!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[StatsService] running on port ${PORT}`);
});
