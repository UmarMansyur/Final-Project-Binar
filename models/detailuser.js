"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DetailUser.init(
    {
      user_id: DataTypes.INTEGER,
      fullname: DataTypes.STRING,
      gender: DataTypes.ENUM("Male", "Female"),
      country: DataTypes.STRING,
      province: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.TEXT,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DetailUser",
    }
  );
  return DetailUser;
};
