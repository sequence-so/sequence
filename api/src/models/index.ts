import User from "./user";
import AuthGoogle from "./auth_google";
import AuthIntercom from "./auth_intercom";
import ProductUser from "./product_user";
import SegmentWebhook from "./segment_webhook";
import sequelize from "../database";

async function buildModels() {
  try {
    console.log("syncing models");
    await sequelize.sync();
    return {
      User,
      AuthGoogle,
      AuthIntercom,
      ProductUser,
      SegmentWebhook,
    };
  } catch (error) {
    console.error(error);
  }
}
export default buildModels;
