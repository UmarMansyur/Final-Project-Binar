"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Flights", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      airlineName: {
        type: Sequelize.STRING,
      },
      departureCity: {
        type: Sequelize.STRING,
      },
      arrivalCity: {
        type: Sequelize.STRING,
      },
      departureTime: {
        type: Sequelize.TIME,
      },
      arrivalTime: {
        type: Sequelize.STRING,
      },
      totalSeat: {
        type: Sequelize.INTEGER,
      },
      classPassenger: {
        type: Sequelize.STRING,
      },
      gate: {
        type: Sequelize.STRING,
      },
      boardingTime: {
        type: Sequelize.TIME,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      stock: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Flights");
  },
};
