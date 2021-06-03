"use strict";

const { STRING, UUID, TEXT, INTEGER, BOOLEAN } = require("sequelize");
const uuidv4 = require("uuid").v4;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("auth_intercoms", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      code: {
        type: STRING,
      },
      token: {
        type: STRING,
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
    await queryInterface.dropTable("auth_intercoms");
  },
};
