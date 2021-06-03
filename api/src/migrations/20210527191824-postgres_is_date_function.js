"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`create or replace function is_date(s varchar) returns boolean as $$
    begin
      perform s::date;
      return true;
    exception when others then
      return false;
    end;
    $$ language plpgsql`);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`drop function is_date`);
  },
};
