"use strict";

const { STRING, UUID, DATE, INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("segment_webhook", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
      token: {
        type: STRING,
      },
      executions: {
        type: INTEGER,
        defaultValue: 0,
      },
      lastExecutionAt: {
        type: DATE,
      },
      userId: {
        type: UUID,
        references: {
          model: "users",
          key: "id",
        },
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
    await queryInterface.dropTable("segment_webhook");
  },
};
