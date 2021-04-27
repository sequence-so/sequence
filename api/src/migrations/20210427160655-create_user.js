"use strict";

const uuidv4 = require("uuid").v4;
const { STRING, UUID } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
      firstName: {
        type: STRING,
      },
      lastName: {
        type: STRING,
      },
      email: {
        type: STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      photo: {
        type: STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
