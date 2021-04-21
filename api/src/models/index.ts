import User from "./user";
import AuthGoogle from "./auth_google";
import sequelize from "../database";

async function buildModels() {
  try {
    console.log("syncing models");
    await sequelize.sync({ force: true });
    // await sequelize.sync({});
  } catch (error) {
    console.error(error);
  }
}
export default buildModels;
