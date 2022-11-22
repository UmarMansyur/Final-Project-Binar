'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      departure_city: {
        type: Sequelize.STRING
      },
      arrival_city: {
        type: Sequelize.STRING
      },
      arrival_time: {
        type: Sequelize.STRING
      },
      date_flight: {
        type: Sequelize.DATE
      },
      flight_number: {
        type: Sequelize.STRING
      },
      class: {
        type: Sequelize.ENUM,
        values: ['Economy', 'Business']
      },
      gate: {
        type: Sequelize.INTEGER
      },
      seat: {
        type: Sequelize.STRING
      },
      boarding_time: {
        type: Sequelize.TIME
      },
      price: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tickets');
  }
};