import CampaignGraph from "./CampaignGraph";
import AbstractCampaignNode from "./nodes/abstractCampaignNode";
import { CampaignGraphEdges } from "./types";

export const buildCampaign = (
  nodes: AbstractCampaignNode[],
  edges: CampaignGraphEdges
) => {
  const graph = new CampaignGraph();
  nodes.forEach((node) => graph.addNode(node));
  Object.keys(edges).forEach((source) => {
    const destination = edges[source];
    graph.addEdge(source, destination);
  });
  return graph;
};
