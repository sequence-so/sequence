"use strict";

const { STRING, UUID, TEXT, DATE, BOOLEAN } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("product_users", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
      intercomId: {
        type: STRING,
      },
      externalId: {
        type: STRING,
      },
      firstName: {
        type: STRING,
      },
      lastName: {
        type: STRING,
      },
      email: {
        type: STRING,
      },
      photo: {
        type: STRING,
      },
      signedUpAt: {
        type: DATE,
      },
      lastSeenAt: {
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
    await queryInterface.dropTable("product_users");
  },
};
