"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameTable("campaigns", "blasts");
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameTable("blasts", "campaigns");
  },
};
