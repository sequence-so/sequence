"use strict";

const { STRING, UUID, JSON } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("audience_product_users", {
      id: {
        primaryKey: true,
        unique: true,
        type: UUID,
        allowNull: false,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      productUserId: {
        type: Sequelize.UUID,
        references: {
          model: "product_users",
          key: "id",
        },
        allowNull: false,
        onDelete: "cascade",
      },
      audienceId: {
        type: Sequelize.UUID,
        references: {
          model: "audiences",
          key: "id",
        },
        allowNull: false,
        onDelete: "cascade",
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("audience_product_users");
  },
};
