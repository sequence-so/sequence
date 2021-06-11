"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("campaign_node_edges", {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      fromId: {
        type: Sequelize.UUID,
        references: {
          model: "campaign_nodes",
          key: "id",
        },
        allowNull: false,
      },
      toId: {
        type: Sequelize.UUID,
        references: {
          model: "campaign_nodes",
          key: "id",
        },
        allowNull: false,
      },
      edgeKind: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("campaign_node_edges");
  },
};
