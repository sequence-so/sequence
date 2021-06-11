"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "emails",
        "localTo",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "audiences",
        "localTo",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("emails", "localTo", {
        transaction,
      });
      await queryInterface.removeColumn("audiences", "localTo", {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
