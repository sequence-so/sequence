import User from "./user";
import AuthGoogle from "./auth_google";
import AuthIntercom from "./auth_intercom";
import ProductUser from "./product_user";
import sequelize from "../database";

async function buildModels() {
  try {
    console.log("syncing models");
    await sequelize.sync({ force: true });
    return {
      User,
      AuthGoogle,
      AuthIntercom,
      ProductUser,
    };
  } catch (error) {
    console.error(error);
  }
}
export default buildModels;
