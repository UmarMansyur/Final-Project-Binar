"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Passenger.belongsTo(models.DetailTransaction, {foreignKey: 'detail_transaction_id', as: 'passenger'});
      
      // define association here
      // Passenger.belongsTo(models.DetailTransaction, {foreignKey: 'detailTransactionId'});
    }
  }
  Passenger.init(
    {
      detail_transaction_id: DataTypes.INTEGER,
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phone: DataTypes.STRING,
      type: DataTypes.STRING,
      travelDocument: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Passenger",
    }
  );
  return Passenger;
};
