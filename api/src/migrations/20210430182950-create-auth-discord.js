"use strict";

const { STRING, UUID, TEXT, INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("auth_discords", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      discordId: {
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
      webhookId: {
        type: STRING,
      },
      channelId: {
        type: STRING,
      },
      webhookToken: {
        type: STRING,
      },
      expiresAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("auth_discords");
  },
};
