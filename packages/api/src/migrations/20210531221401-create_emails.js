"use strict";
const literal = require("sequelize").literal;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("emails", {
      id: {
        primaryKey: true,
        unique: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: literal("uuid_generate_v4()"),
      },
      name: {
        type: Sequelize.STRING,
      },
      from: {
        type: Sequelize.STRING,
      },
      fromName: {
        type: Sequelize.STRING,
      },
      bodyHtml: {
        type: Sequelize.TEXT,
      },
      subject: {
        type: Sequelize.STRING,
      },
      sentCount: Sequelize.INTEGER,
      userId: {
        type: Sequelize.UUID,
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
  down: async (queryInterface) => {
    await queryInterface.dropTable("emails");
  },
};
