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
      code: {
        type: Sequelize.STRING,
      },
      airlineName: {
        type: Sequelize.STRING,
      },
      departureAirport: {
        type: Sequelize.STRING,
      },
      departure: {
        type: Sequelize.STRING,
      },
      arrivalAirport: {
        type: Sequelize.STRING,
      },
      arrival: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      departureTime: {
        type: Sequelize.TIME,
      },
      arrivalTime: {
        type: Sequelize.TIME,
      },
      price: {
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
