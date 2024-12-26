const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Assuming this file has the Sequelize connection

const Patient = sequelize.define('Patient', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',  // Make sure the 'Users' table exists
      key: 'id'
    }
  }
}, { paranoid: true });

module.exports = Patient;  // Export the model
