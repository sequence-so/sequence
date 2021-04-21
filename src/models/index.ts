import User from "./user";
import sequelize from "../database";

async function buildModels() {
  try {
    console.log("syncing models");
    await sequelize.sync();
  } catch (error) {
    console.error(error);
  }
}
export default buildModels;
