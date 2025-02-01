// src/models/userInteraction.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserInteraction = sequelize.define('UserInteraction', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  actionType: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  watchTime: {
    type: DataTypes.INTEGER, 
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_interactions',
  timestamps: false, 
});

export default UserInteraction;
