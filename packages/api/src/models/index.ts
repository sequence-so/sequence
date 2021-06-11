import Audience from "./audience.model";
import AudienceProductUser from "./audienceProductUser.model";
import AuthIntercom from "./authIntercom.model";
import Blast from "./blast.model";
import Campaign from "./campaign.model";
import CampaignNode from "./campaignNode.model";
import CampaignNodeEdge from "./campaignNodeEdge.model";
import CampaignNodeState from "./campaignNodeState.model";
import CustomProperty from "./customProperty.model";
import Email from "./email.model";
import Event from "./event.model";
import ProductUser from "./productUser.model";
import SegmentWebhook from "./segmentWebhook.model";
import SequenceWebhook from "./sequenceWebhook.model";
import User from "./user.model";
import WebhookExecution from "./webhookExecution.model";

const Models = {
  Audience,
  AudienceProductUser,
  AuthIntercom,
  Blast,
  Campaign,
  CampaignNode,
  CampaignNodeEdge,
  CampaignNodeState,
  CustomProperty,
  Email,
  Event,
  ProductUser,
  SegmentWebhook,
  SequenceWebhook,
  User,
  WebhookExecution,
};

export default Models;

export type SequelizeModels = typeof Models;
