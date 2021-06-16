import { GraphQLContextType } from "..";
import {
  CampaignCreationAttributes,
  CampaignStateEnum,
} from "src/models/campaign.model";
import SequenceError, {
  FORBIDDEN_ERROR,
  MODEL_NOT_FOUND,
} from "src/error/sequenceError";
import CampaignNodeEvaluator from "src/services/campaigns/campaignNodeEvaluator";

type CreateCampaignInputArgs = Omit<CampaignCreationAttributes, "userId">;

type UpdateCampaignInputArgs = CreateCampaignInputArgs & {
  id: string;
};

export const createCampaign = async (
  _: any,
  args: CreateCampaignInputArgs,
  { user, repositories }: GraphQLContextType
) => {
  return repositories.campaignRepository.createCampaign({
    userId: user.id,
    name: args.name,
    state: CampaignStateEnum.PENDING,
    isDraft: true,
  });
};

export const updateCampaign = async (
  root: any,
  args: UpdateCampaignInputArgs,
  { user, repositories }: GraphQLContextType
) => {
  return repositories.campaignRepository.updateCampaign(args.id, user.id, args);
};

export const launchCampaign = async (
  root: any,
  args: UpdateCampaignInputArgs,
  { models, user, app }: GraphQLContextType
) => {
  const campaign = await models.Campaign.findOne({
    where: {
      id: args.id,
      userId: user.id,
    },
  });

  if (!campaign) {
    throw new SequenceError("No campaign found", MODEL_NOT_FOUND);
  }

  if (campaign.stoppedAt) {
    throw new SequenceError(
      "Resuming a campaign is not supported yet",
      FORBIDDEN_ERROR
    );
  }

  if (campaign.launchedAt) {
    throw new SequenceError("Cannot launch a campaign twice", FORBIDDEN_ERROR);
  }

  // 1. update campaign status
  await campaign.update({
    state: CampaignStateEnum.RUNNING,
    launchedAt: new Date(),
    isDraft: false,
  });

  // 2. execute the first campaign steps
  const campaignNodeEvaluator = new CampaignNodeEvaluator(
    app,
    user.id,
    campaign.id
  );
  await campaignNodeEvaluator.build();
  await campaignNodeEvaluator.evaluateCampaignEntryNodes();
  return campaign;
};

export const stopCampaign = async (
  root: any,
  args: UpdateCampaignInputArgs,
  { models, user, app }: GraphQLContextType
) => {
  const campaign = await models.Campaign.findOne({
    where: {
      id: args.id,
      userId: user.id,
    },
  });

  if (!campaign) {
    throw new SequenceError("No campaign found", MODEL_NOT_FOUND);
  }

  if (campaign.stoppedAt) {
    return campaign;
  }

  // Stop the campaign
  await campaign.update({
    state: CampaignStateEnum.STOPPED,
    stoppedAt: new Date(),
  });

  // Stop the campaign node state
  await models.CampaignNodeState.update(
    {
      state: CampaignStateEnum.STOPPED,
    },
    {
      where: {
        campaignId: args.id,
      },
    }
  );

  return campaign;
};
