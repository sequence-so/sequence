"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "events",
        "timestamp",
        {
          type: Sequelize.DATE,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "events",
        "sentAt",
        {
          type: Sequelize.DATE,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "events",
        "receivedAt",
        {
          type: Sequelize.DATE,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "events",
        "context",
        {
          type: Sequelize.JSONB,
        },
        { transaction }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE "events" ALTER COLUMN "properties" TYPE JSONB USING properties::JSONB`,
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
      await queryInterface.removeColumn("events", "timestamp", { transaction });
      await queryInterface.removeColumn("events", "sentAt", { transaction });
      await queryInterface.removeColumn("events", "receivedAt", {
        transaction,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE "events" ALTER COLUMN "properties" TYPE JSON`,
        { transaction }
      );
      await queryInterface.removeColumn("events", "context", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
