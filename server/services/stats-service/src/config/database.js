import { Sequelize } from 'sequelize';

const DB_URL = 'postgres://user:password@localhost:5432/stats_db';

const sequelize = new Sequelize(DB_URL, {
  logging: false,
});

export default sequelize;
