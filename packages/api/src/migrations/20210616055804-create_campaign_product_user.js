"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("campaign_product_users", {
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
      state: {
        type: Sequelize.STRING,
      },
      didTimeout: {
        type: Sequelize.BOOLEAN,
      },
      attempts: {
        allowNull: false,
        defaultValue: 0,
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
      productUserId: {
        type: Sequelize.UUID,
        references: {
          model: "product_users",
          key: "id",
        },
        allowNull: false,
      },
      campaignNodeStateId: {
        type: Sequelize.UUID,
        references: {
          model: "campaign_node_state",
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
      completedAt: {
        type: Sequelize.DATE,
      },
      stoppedAt: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("campaign_product_users");
  },
};
