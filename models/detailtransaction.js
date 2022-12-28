"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DetailTransaction.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transaction",
      });
      DetailTransaction.belongsTo(models.Flight, {
        foreignKey: "flight_id",
        as: "flight",
      });
      DetailTransaction.hasMany(models.Passenger, {
        foreignKey: "detail_transaction_id",
        as: "passenger",
      });
      DetailTransaction.hasMany(models.Ticket, {
        foreignKey: "detail_transaction_id",
        as: "tiket",
      });
    }
  }
  DetailTransaction.init(
    {
      transaction_id: DataTypes.INTEGER,
      flight_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DetailTransaction",
    }
  );
  return DetailTransaction;
};
