"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("event_imports", {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cursor: {
        type: Sequelize.STRING,
      },
      cursorType: {
        type: Sequelize.STRING,
      },
      batchSize: {
        type: Sequelize.INTEGER,
        defaultValue: 20,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      executedAt: {
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
    await queryInterface.dropTable("event_imports");
  },
};
