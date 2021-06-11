"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("campaign_node_states", {
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
      campaignNodeId: {
        type: Sequelize.UUID,
        references: {
          model: "campaign_nodes",
          key: "id",
        },
        allowNull: false,
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
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      runAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      timeoutAt: {
        type: Sequelize.DATE,
      },
      completedAt: {
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
    await queryInterface.dropTable("campaign_node_state");
  },
};
