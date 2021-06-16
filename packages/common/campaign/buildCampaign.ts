import CampaignGraph from "./campaignGraph";
import { Edge } from "./nodes";
import AbstractCampaignNode from "./nodes/abstractCampaignNode";
import { CampaignGraphEdges, CampaignNodeKind, CustomEdge } from "./types";

export const validateEdge = (
  from: AbstractCampaignNode,
  to: AbstractCampaignNode
) => {
  if (
    to.kind === CampaignNodeKind.Audience ||
    to.kind === CampaignNodeKind.Trigger
  ) {
    return false;
  }
  return true;
};

export const buildCampaign = ({
  nodes,
  edges,
}: {
  nodes: AbstractCampaignNode[];
  edges: Edge[];
}) => {
  const graph = new CampaignGraph();
  let errors: string[] = [];
  let cycles: string[][] = [];
  nodes.forEach((node) => graph.addNode(node));

  edges.forEach((edge) => {
    const fromId = edge.getFromId()!;
    const toId = edge.getToId()!;
    const from = graph.getNodeById(fromId);
    const to = graph.getNodeById(toId);

    if (!to) {
      errors.push("No `to` node found for this edge: " + edge.getId());
      return;
    }
    if ((to as AbstractCampaignNode).kind) {
      if (!validateEdge(from, to)) {
        errors.push(
          `Campaign Node of type "${from.kind}" cannot connect to a "${to.kind}"`
        );
      }
      graph.addEdge(
        fromId,
        to as AbstractCampaignNode,
        edge.getEdgeKind(),
        edge.getId()
      );
    }
  });

  if ((cycles = graph.getCycles())) {
    errors = errors.concat(
      ...cycles.map((elem) => `Detected cycle from ${elem[0]} to ${elem[1]}`)
    );
  }

  return { graph, errors };
};
