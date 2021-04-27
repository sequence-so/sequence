"use strict";
const uuidv4 = require("uuid").v4;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("organizations", {
      id: {
        primaryKey: true,
        unique: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
      name: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
      },
      ownerId: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable("organizations");
  },
};
