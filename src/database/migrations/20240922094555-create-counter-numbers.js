"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("counter_numbers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
      },
      day: {
        type: Sequelize.INTEGER,
      },
      month: {
        type: Sequelize.INTEGER,
      },
      year: {
        type: Sequelize.INTEGER,
      },
      sub_year: {
        type: Sequelize.INTEGER,
      },
      number: {
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
    await queryInterface.dropTable("counter_numbers");
  },
};
