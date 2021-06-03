"use strict";
const { STRING, UUID, TEXT, INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sequence_webhook", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      token: {
        type: Sequelize.STRING,
      },
      executions: {
        type: Sequelize.INTEGER,
      },
      lastExecutionAt: {
        type: Sequelize.DATE,
      },
      userId: {
        type: UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("now()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("now()"),
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("sequence_webhook");
  },
};
