"use strict";

const { STRING, UUID, DATE } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("product_users", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
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
      browser: {
        type: STRING,
      },
      browserVersion: {
        type: STRING,
      },
      browserLanguage: {
        type: STRING,
      },
      os: {
        type: STRING,
      },
      country: {
        type: STRING,
      },
      region: {
        type: STRING,
      },
      city: {
        type: STRING,
      },
      title: {
        type: STRING,
      },
      websiteUrl: {
        type: STRING,
      },
      companyName: {
        type: STRING,
      },
      industry: {
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
    await queryInterface.dropTable("product_users");
  },
};
