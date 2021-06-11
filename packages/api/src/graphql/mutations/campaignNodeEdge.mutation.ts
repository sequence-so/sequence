import { GraphQLContextType } from "..";
import SequenceError from "src/error/sequenceError";
import { CampaignNodeEdgeAttributes } from "src/models/campaignNodeEdge.model";

type CreateNodeCampaignInputArgs = Omit<CampaignNodeEdgeAttributes, "userId">;

export const connectCampaignNodes = async (
  root: any,
  args: CreateNodeCampaignInputArgs,
  { models, user }: GraphQLContextType
) => {
  const existing = await models.CampaignNode.findAll({
    where: {
      id: [args.fromId, args.toId],
      userId: user.id,
    },
  });

  if (!(existing[0] && existing[1])) {
    throw new SequenceError("Could not find these nodes", 422);
  }
  const edge = await models.CampaignNodeEdge.create({
    id: args.id,
    fromId: args.fromId,
    toId: args.toId,
    edgeKind: args.edgeKind,
  });

  return edge;
};

export const deleteCampaignNodeEdge = async (
  root: any,
  args: { id: string },
  { models, user }: GraphQLContextType
) => {
  const node = await models.CampaignNodeEdge.findOne({
    where: {
      id: args.id,
    },
  });
  if (!node) {
    throw new SequenceError("Campaign node edge not found", 422);
  }
  await node.destroy();

  return { success: true };
};
