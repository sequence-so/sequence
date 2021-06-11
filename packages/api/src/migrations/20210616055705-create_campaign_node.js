"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("campaign_nodes", {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      name: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      json: {
        type: Sequelize.JSONB,
      },
      positionX: {
        type: Sequelize.INTEGER,
      },
      positionY: {
        type: Sequelize.INTEGER,
      },
      timeoutAfter: {
        type: Sequelize.INTEGER,
      },
      campaignId: {
        type: Sequelize.UUID,
        references: {
          model: "campaigns",
          key: "id",
        },
        allowNull: false,
      },
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
    await queryInterface.dropTable("campaign_nodes");
  },
};
