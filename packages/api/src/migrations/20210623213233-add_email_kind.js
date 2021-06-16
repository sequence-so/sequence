"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("emails", "kind", {
      type: Sequelize.STRING,
      defaultValue: "rich",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("emails", "kind");
  },
};
