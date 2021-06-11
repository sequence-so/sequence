import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import { CampaignNodeKind, Edge, EdgeKind } from "common/campaign";
import AudienceCampaignNode from "common/campaign/nodes/audienceCampaignNode";
import TriggerCampaignNode from "common/campaign/nodes/triggerCampaignNode";
import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import WaitCampaignNode from "common/campaign/nodes/waitCampaignNode";
import FilterCampaignNode from "common/campaign/nodes/filterCampaignNode";
import { EdgeElementType, NodeElementType } from "./CampaignEditorGrid";

export const createNodeElementType = (
  node: AbstractCampaignNode
): NodeElementType => {
  switch (node.kind) {
    case CampaignNodeKind.Audience:
      const audienceNode = node as AudienceCampaignNode;
      return {
        id: node.id,
        type: node.kind,
        data: {
          id: node.id,
          audienceName: audienceNode.audienceName,
          audienceId: audienceNode.audienceId,
        },
        position: { x: audienceNode.positionX, y: audienceNode.positionY },
        arrowHeadType: "arrowclosed",
      };
    case CampaignNodeKind.Trigger:
      const triggerNode = node as TriggerCampaignNode;
      return {
        id: node.id,
        type: node.kind,
        data: {
          id: node.id,
          audienceName: triggerNode.audienceName,
          audienceId: triggerNode.audienceId,
        },
        position: { x: triggerNode.positionX, y: triggerNode.positionY },
        arrowHeadType: "arrowclosed",
      };
    case CampaignNodeKind.Filter:
      const filterNode = node as FilterCampaignNode;
      return {
        id: node.id,
        type: node.kind,
        data: {
          id: node.id,
          audienceName: filterNode.audienceName,
          audienceId: filterNode.audienceId,
        },
        position: { x: filterNode.positionX, y: filterNode.positionY },
        arrowHeadType: "arrowclosed",
      };
    case CampaignNodeKind.Email:
      const emailNode = node as EmailCampaignNode;
      return {
        id: node.id,
        type: node.kind,
        data: {
          id: node.id,
          emailId: emailNode.getEmailId(),
        },
        position: { x: emailNode.positionX, y: emailNode.positionY },
        arrowHeadType: "arrowclosed",
      };
    case CampaignNodeKind.Wait:
      const waitNode = node as WaitCampaignNode;
      return {
        id: node.id,
        type: node.kind,
        data: {
          id: node.id,
          days: waitNode.getDays(),
        },
        position: { x: waitNode.positionX, y: waitNode.positionY },
        arrowHeadType: "arrowclosed",
      };
  }
};

export const createEdgeElementType = (edge: Edge): EdgeElementType => {
  const edgeType: EdgeElementType = {
    id: edge.getId(),
    source: edge.getFromId(),
    target: edge.getToId(),
    type: edge.getEdgeKind(),
  };
  if (edge.getEdgeKind() === EdgeKind.Timeout) {
    edgeType.sourceHandle = EdgeKind.Timeout;
  }
  return edgeType;
};
