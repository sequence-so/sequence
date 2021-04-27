import User from "./user";
import AuthGoogle from "./auth_google";
import AuthIntercom from "./auth_intercom";
import AuthDatabase from "./auth_database";
import ProductUser from "./product_user";
import SegmentWebhook from "./segment_webhook";
import WebhookExecution from "./webhook_execution";

async function buildModels() {
  try {
    return {
      User,
      AuthDatabase,
      AuthGoogle,
      AuthIntercom,
      ProductUser,
      SegmentWebhook,
      WebhookExecution,
    };
  } catch (error) {
    console.error(error);
  }
}
export default buildModels;
