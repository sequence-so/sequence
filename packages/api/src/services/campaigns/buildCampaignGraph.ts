import { Op } from "sequelize";
import { buildCampaign, deserialize, Edge } from "common/campaign";
import SequenceError from "src/error/sequenceError";
import { SequelizeModels } from "src/models";
import CampaignNodeModel from "src/models/campaignNode.model";
import CampaignNodeEdgeModel from "src/models/campaignNodeEdge.model";
import logger from "src/utils/logger";

export const getCampaignNodesAndEdges = async (
  models: SequelizeModels,
  userId: string,
  campaignId: string
): Promise<{ nodes: CampaignNodeModel[]; edges: CampaignNodeEdgeModel[] }> => {
  const getCampaignNodes = async () => {
    return models.CampaignNode.findAll({
      where: {
        userId,
        campaignId,
      },
    });
  };

  const getCampaignEdges = async (nodes: CampaignNodeModel[]) => {
    const nodeIdList = nodes.map((n) => n.id);
    return models.CampaignNodeEdge.findAll({
      where: {
        [Op.or]: [
          {
            fromId: nodeIdList,
          },
          {
            toId: nodeIdList,
          },
        ],
      },
    });
  };

  const campaignNodes = await getCampaignNodes();
  const campaignEdges = await getCampaignEdges(campaignNodes);

  return { nodes: campaignNodes, edges: campaignEdges };
};

export const buildCampaignGraph = async (
  models: SequelizeModels,
  userId: string,
  campaignId: string
) => {
  const { nodes: dbNodes, edges: dbEdges } = await getCampaignNodesAndEdges(
    models,
    userId,
    campaignId
  );

  const nodes = dbNodes.map((node) => deserialize(node as any));
  const edges = dbEdges.map((edge) =>
    Edge.new(edge.fromId, edge.toId, edge.edgeKind).setId(edge.id)
  );
  const { errors, graph } = buildCampaign({
    edges,
    nodes,
  });
  if (errors.length) {
    const err = new SequenceError("Could not build campaign due to errors", 500);
    logger.error("[buildCampaignGraph] Build errors:" + errors.join(","));
    err.errors = errors;
    throw err;
  }
  return { graph, nodes, edges };
};
