"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.query(
      `ALTER TABLE "events" RENAME COLUMN "distinctId" TO "personId"`
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.query(
      `ALTER TABLE "events" RENAME COLUMN "personId" TO "distinctId"`
    );
  },
};
