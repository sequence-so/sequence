"use strict";

const { STRING, UUID, TEXT, INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("auth_googles", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      googleId: {
        type: STRING,
        allowNull: false,
      },
      accessToken: {
        type: STRING,
      },
      refreshToken: {
        type: STRING,
      },
      email: {
        type: STRING,
      },
      photo: {
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
    await queryInterface.dropTable("auth_googles");
  },
};
