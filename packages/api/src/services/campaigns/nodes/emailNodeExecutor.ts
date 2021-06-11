import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import CampaignNodeState from "src/models/campaignNodeState.model";
import Email from "src/models/email.model";
import ProductUser from "src/models/productUser.model";
import AbstractNodeExecutor from "./abstractNodeExecutor";
import logger from "src/utils/logger";
import ExecutionResult, { ExecutionResultEnum } from "../executionResult";
import App from "src/app";
import SendEmail from "src/services/email/sendEmail";
import CampaignNodeExecutionError from "src/error/campaignNodeExecutionError";

class EmailNodeExecutor extends AbstractNodeExecutor<any> {
  node: EmailCampaignNode;
  constructor(app: App, node: EmailCampaignNode) {
    super(app, node);
  }
  async execute(state: CampaignNodeState) {
    logger.info(
      "[EmailNodeExecutor:execute] Executing campaign node state " + state.id
    );
    const productUserId = state.productUserId;
    const userId = state.userId;
    let emailModel: Email;
    let productUser: ProductUser;

    productUser = await this.app.models.ProductUser.findOne({
      where: {
        id: productUserId,
      },
    });

    if (!productUser) {
      logger.error(
        `[EmailNodeExecutor:execute] FATAL: Could not find product user for id: ${productUser.id}`
      );
      throw new CampaignNodeExecutionError("ProductUser not found");
    }

    emailModel = await this.app.models.Email.findOne({
      where: {
        userId: userId,
        id: this.node.getEmailId(),
      },
    });

    if (!emailModel) {
      logger.error(
        `[EmailNodeExecutor:execute] FATAL: Could not find emailModel for id: ${this.node.getEmailId()}`
      );
      throw new CampaignNodeExecutionError("Email not found");
    }

    const sendEmail = new SendEmail();
    sendEmail
      .setProvider(this.app.getEmail().getProvider())
      .setEmail(emailModel)
      .setProductUser(productUser);

    try {
      await sendEmail.send();
    } catch (error) {
      logger.error(
        `[EmailNodeExecutor:execute] An error occurred while sending the email ${this.node.getEmailId()} for node state: ${
          state.id
        }`
      );
      logger.error(error);
      throw new CampaignNodeExecutionError("Could not send the email");
    }
    return new ExecutionResult(
      ExecutionResultEnum.Continue,
      sendEmail.getPayload()
    );
  }
}

export default EmailNodeExecutor;
