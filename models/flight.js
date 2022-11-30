'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Flight.hasMany(models.DetailTransaction, {foreignKey: 'flight_id'});
      
    }
  }
  Flight.init({
    airlineName: DataTypes.STRING,
    departureCity: DataTypes.STRING,
    arrivalCity: DataTypes.STRING,
    departureTime: DataTypes.TIME,
    arrivalTime: DataTypes.STRING,
    totalSeat: DataTypes.INTEGER,
    class: DataTypes.STRING,
    gate: DataTypes.STRING,
    boardingTime: DataTypes.TIME,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};