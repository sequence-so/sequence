"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("campaign_analytics", {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      viewed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      clicked: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      bounced: {
        type: Sequelize.BOOLEAN,
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
          model: "campaign_node_states",
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
      sentAt: {
        type: Sequelize.DATE,
      },
      viewedAt: {
        type: Sequelize.DATE,
      },
      clickedAt: {
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
    await queryInterface.dropTable("campaign_analytics");
  },
};
