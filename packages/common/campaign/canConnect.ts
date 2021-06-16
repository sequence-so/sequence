import AbstractCampaignNode from "./nodes/abstractCampaignNode";
import { CampaignNodeKind } from "./types";

const connectable = (node: AbstractCampaignNode) =>
  node.kind === CampaignNodeKind.Email ||
  node.kind === CampaignNodeKind.Wait ||
  node.kind === CampaignNodeKind.Filter;

export const canConnect = (
  from: AbstractCampaignNode,
  to: AbstractCampaignNode
) => {
  switch (from.kind) {
    case CampaignNodeKind.Audience:
    case CampaignNodeKind.Trigger:
    case CampaignNodeKind.Filter:
    case CampaignNodeKind.Email:
    case CampaignNodeKind.Wait:
      return connectable(to);
  }
};
