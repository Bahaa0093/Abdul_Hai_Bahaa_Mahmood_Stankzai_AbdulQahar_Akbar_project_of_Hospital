'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Appointment.belongsTo(models.User, { foreignKey: 'userId' });
      models.Appointment.belongsTo(models.Patient, { foreignKey: 'patientId' });
    }
  }
  Appointment.init({
    date: DataTypes.DATE,
    time: DataTypes.STRING,
    reason: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'Appointment',
  });
  return Appointment;
};