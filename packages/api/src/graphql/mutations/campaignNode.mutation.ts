import { GraphQLContextType } from "..";
import { CampaignNodeCreationAttributes } from "../../models/campaignNode.model";
import SequenceError from "src/error/sequenceError";
import {
  AudienceNodeJson,
  CampaignAudienceRules,
  CampaignNodeKind,
} from "common/campaign";
import Audience from "src/models/audience.model";
import CampaignNodeEdge from "src/models/campaignNodeEdge.model";
import { Op } from "sequelize";

type CreateNodeCampaignInputArgs = Omit<
  CampaignNodeCreationAttributes,
  "userId"
>;

type UpdateCampaignNodeInputArgs = CreateNodeCampaignInputArgs & {
  id: string;
};

export const createCampaignNode = async (
  root: any,
  args: CreateNodeCampaignInputArgs,
  { models, user }: GraphQLContextType
) => {
  const campaign = await models.CampaignNode.create({
    id: args.id,
    name: args.name,
    positionX: args.positionX || 0,
    positionY: args.positionY || 0,
    json: args.json || {},
    kind: args.kind,
    timeoutAfter: args.timeoutAfter || null,
    userId: user.id,
    campaignId: args.campaignId,
  });

  return campaign;
};

export const updateCampaignNode = async (
  root: any,
  args: UpdateCampaignNodeInputArgs,
  { models, user }: GraphQLContextType
) => {
  const node = await models.CampaignNode.findOne({
    where: {
      id: args.id,
      userId: user.id,
    },
  });
  if (!node) {
    throw new SequenceError("Campaign node not found", 422);
  }

  if (node.kind === CampaignNodeKind.Audience) {
    const json = args.json as AudienceNodeJson;

    if (json) {
      if (json.audienceId) {
        const exists = await Audience.findOne({
          where: {
            userId: user.id,
            id: json.audienceId,
          },
        });
        if (!exists) {
          throw new SequenceError(
            "No Audience found for given id: " + json.audienceId,
            404
          );
        }
      }
      if (
        json.audienceRules &&
        typeof CampaignAudienceRules[json.audienceRules] === "undefined"
      ) {
        throw new SequenceError(
          "Invalid CampaignAudienceRules provided: " + json.audienceRules,
          422
        );
      }
    }
  }
  delete args.campaignId;
  delete args.id;

  return await node.update(args);
};

export const deleteCampaignNode = async (
  root: any,
  args: { id: string },
  { models, user }: GraphQLContextType
) => {
  const node = await models.CampaignNode.findOne({
    where: {
      id: args.id,
      userId: user.id,
    },
  });
  if (!node) {
    throw new SequenceError("Campaign node not found", 422);
  }
  // Remove from all edges first
  await CampaignNodeEdge.destroy({
    where: {
      [Op.or]: [
        {
          fromId: node.id,
        },
        {
          toId: node.id,
        },
      ],
    },
  });

  // Remove the node
  await node.destroy();

  return { success: true };
};
