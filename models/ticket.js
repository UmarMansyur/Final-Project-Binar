'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ticket.init({
    departure_city: DataTypes.STRING,
    arrival_city: DataTypes.STRING,
    arrival_time: DataTypes.STRING,
    date_flight: DataTypes.DATE,
    flight_number: DataTypes.STRING,
    class: DataTypes.ENUM,
    gate: DataTypes.INTEGER,
    seat: DataTypes.STRING,
    boarding_time: DataTypes.TIME,
    price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};