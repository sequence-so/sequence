"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn("users", "password", {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn("users", "password");
  },
};
