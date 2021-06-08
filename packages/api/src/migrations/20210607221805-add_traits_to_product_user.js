"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "product_users",
        "phone",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "product_users",
        "traits",
        {
          type: Sequelize.JSONB,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "product_users",
        "context",
        {
          type: Sequelize.JSONB,
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
      await queryInterface.removeColumn("product_users", "phone", {
        transaction,
      });
      await queryInterface.removeColumn("product_users", "traits", {
        transaction,
      });
      await queryInterface.removeColumn("product_users", "context", {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
