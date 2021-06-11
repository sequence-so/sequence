import EventEmitter from "eventemitter3";
import AbstractEditorState from "./AbstractNodeState";
import DefaultEditorState from "./DefaultEditorState";
import {
  buildCampaign,
  CampaignGraph,
  deserialize,
  Edge,
  EdgeKind,
} from "common/campaign";
import { GetCampaignsWithNodes_campaigns_nodes } from "__generated__/GetCampaignsWithNodes";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import InspectorNodeState from "./InspectorNodeState";
import ConnectingNodesEditorState from "./ConnectingNodesEditorState";
import { OnConnectStartParams } from "react-flow-renderer";

export interface EditorOperation {
  type: string;
  model: string;
  id?: string;
}

export class EditorStateManager {
  operationId: number;
  state: AbstractEditorState;
  emitter: EventEmitter;
  graph: CampaignGraph;
  reactFlowInstance: any;
  campaignId: string;
  campaign: GetCampaignsWithNodes_campaigns_nodes;
  operations: EditorOperation[];
  selectedNode: AbstractCampaignNode;
  draggingPane: boolean;
  constructor(campaign?: GetCampaignsWithNodes_campaigns_nodes) {
    this.operationId = 0;
    this.emitter = new EventEmitter();
    this.state = new DefaultEditorState();
    this.graph = new CampaignGraph();
    this.operations = [];
    this.campaign = { ...campaign };
    this.campaignId = campaign.id;
    this.buildFromSerialized(campaign);
  }
  changeState(newState: AbstractEditorState) {
    this.operationId++;
    this.state = newState;
    newState.editorState = this;
    this.emitter.emit("stateChange", this);
  }
  buildFromSerialized(campaign: GetCampaignsWithNodes_campaigns_nodes) {
    const nodes = campaign.campaignNodes.map((node) =>
      deserialize(node as any)
    );
    let edges = campaign.campaignNodeEdges.map((edge) =>
      Edge.new(edge.fromId, edge.toId, edge.edgeKind as EdgeKind).setId(edge.id)
    );
    const { errors, graph } = buildCampaign({
      edges,
      nodes,
    });
    if (errors) {
      console.error("buildFromSerialized:" + errors);
    }
    this.graph = graph;
  }
  renderSidebar(): JSX.Element {
    return this.state.renderSidebar();
  }
  deleteCampaignNode(campaignNodeId: string) {
    this.operationId++;
    const action = {
      type: "delete",
      model: "campaignNode",
      id: campaignNodeId,
    };
    this.operations.push(action);
    this.graph.removeNodeById(campaignNodeId);
    this.emitter.emit("campaignNodeDelete", action);
    this.changeState(new DefaultEditorState());
  }
  deleteEdge(edgeId: string) {
    this.operationId++;
    const action = {
      type: "delete",
      model: "campaignNodeEdge",
      id: edgeId,
    };
    this.operations.push(action);
    this.graph.removeEdgeById(edgeId);
    this.emitter.emit("campaignNodeEdgeDelete", action);
  }
  selectCampaignNode(campaignNodeId: string) {
    this.operationId++;
    const action = {
      type: "select",
      model: "campaignNode",
      id: campaignNodeId,
    };
    this.operations.push(action);
    this.emitter.emit("campaignNodeSelected", action);
    this.selectedNode = this.graph.getNodeById(campaignNodeId);
    this.changeState(new InspectorNodeState(this.selectedNode));
  }
  deselectNode() {
    this.operationId++;
    const action = {
      type: "deselect",
      model: "campaignNode",
      id: null,
    };
    this.operations.push(action);
    this.emitter.emit("campaignNodeDeselected", action);
    this.selectedNode = null;
    this.changeState(new DefaultEditorState());
  }
  onConnectStart(params: OnConnectStartParams) {
    this.changeState(new ConnectingNodesEditorState());
    this.emitter.emit("onConnectStart", params);
  }
  onConnectingNodes(
    from: AbstractCampaignNode,
    to: AbstractCampaignNode,
    valid: boolean
  ) {
    const state = this.state as ConnectingNodesEditorState;
    state.from = from;
    state.to = to;
    state.valid = valid;
    this.emitter.emit("connecting", { from, to, valid });
  }
  onConnectStop() {
    this.emitter.emit("connectingStop");
    this.changeState(new DefaultEditorState());
  }
  setDraggingPane(draggingPane: boolean) {
    // if (this.draggingPane !== draggingPane) {
    //   this.emitter.emit("draggingPaneChanged", draggingPane);
    //   this.draggingPane = draggingPane;
    // }
  }
  onChangeNodeName(node: AbstractCampaignNode) {
    this.emitter.emit(`campaignNode:${node.id}`, node);
  }
  getDraggingPane() {
    return this.draggingPane;
  }
}

export default EditorStateManager;
