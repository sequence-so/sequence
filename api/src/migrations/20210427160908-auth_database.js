"use strict";

const { STRING, UUID, TEXT, INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("auth_databases", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      type: {
        type: STRING,
      },
      username: {
        type: TEXT,
      },
      hostname: {
        type: TEXT,
      },
      schema: {
        type: TEXT,
      },
      database: {
        type: TEXT,
      },
      password: {
        type: TEXT,
      },
      port: {
        type: INTEGER,
      },
      ssl: {
        type: BOOLEAN,
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
    await queryInterface.dropTable("auth_databases");
  },
};
