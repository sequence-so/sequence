import invariant from "invariant";
import Graph, { GraphInstance } from "sequence-graph-data-structure";
import AbstractCampaignNode from "./nodes/abstractCampaignNode";
import { Edge } from "./nodes";
import { CampaignNodeKind, EdgeKind } from "./types";

type Node = AbstractCampaignNode;
type NodeId = string;
type EdgeId = string;

/**
 * Contains data about the nodes in a Campaign in a queryable format.
 */
class CampaignGraph {
  userId?: string;
  #graph: GraphInstance;
  #nodes: Record<NodeId, Node>;
  #edges: Record<EdgeId, Edge>;
  #sourceNodes: NodeId[];

  constructor(userId?: string) {
    this.userId = userId;
    this.#graph = Graph();
    this.#nodes = {};
    this.#edges = {};
    this.#sourceNodes = [];
  }
  addNode(node: Node) {
    this.#nodes[node.id] = node;
    this.#graph.addNode(node.id);
    if (
      node.kind === CampaignNodeKind.Audience ||
      node.kind === CampaignNodeKind.Trigger
    ) {
      this.#sourceNodes.push(node.id);
    }
  }
  addNodes(...nodes: Node[]) {
    nodes.forEach((n) => this.addNode(n));
  }
  getNodes() {
    return Object.values(this.#nodes);
  }
  addEdge(
    a: Node | NodeId,
    b: Node | NodeId,
    edgeKind: EdgeKind = EdgeKind.Default,
    edgeId?: string
  ) {
    const aId = typeof a === "string" ? a : a.id;
    const bId = typeof b === "string" ? b : b.id;
    invariant(aId, `No ID found on 'a' node`);
    invariant(bId, `No ID found on 'b' node`);

    const edge = Edge.new(aId, bId, edgeKind);
    if (edgeId) {
      edge.setId(edgeId);
    }
    this.#graph.addEdge(
      aId,
      bId,
      edgeKind === EdgeKind.Default ? 0 : 1,
      edge.getId()
    );
    this.#edges[edge.getId()] = edge;
    return edge;
  }
  getEdges() {
    return Object.values(this.#edges);
  }
  getNodeById(id: NodeId) {
    return this.#nodes[id];
  }
  removeEdgeById(edgeId: string) {
    const edge = this.#edges[edgeId];
    delete this.#edges[edgeId];
    this.#graph.removeEdge(edge.getFromId()!, edge.getToId()!);
    return true;
  }
  removeEdge(a: Node | NodeId, b: Node | NodeId): boolean {
    const aNode = typeof a === "object" ? a : this.#nodes[a];
    const bNode = typeof b === "object" ? b : this.#nodes[b];
    const edgeId = this.#graph.getEdgeId(aNode.id, bNode.id);
    if (edgeId) {
      return this.removeEdgeById(edgeId);
    }
    return false;
  }
  removeNode(node: Node) {
    delete this.#nodes[node.id];
    this.#graph.removeNode(node.id);
    if (this.#sourceNodes.indexOf(node.id) > -1) {
      this.#sourceNodes.splice(this.#sourceNodes.indexOf(node.id), 1);
    }
  }
  removeNodeById(nodeId: NodeId) {
    this.removeNode(this.getNodeById(nodeId));
  }
  hasCycle() {
    return this.#graph.hasCycle();
  }
  getCycles() {
    return this.#graph.getCycles(this.getSourceNodeIds()).sort();
  }
  /**
   * Returns all associated Edges for a Node. This includes Default and Timeout edges.
   * @param a Node
   * @returns List of edges
   */
  getOutgoingEdges(a: Node | NodeId): Edge[] {
    const aNode = typeof a === "object" ? a : this.getNodeById(a);
    invariant(aNode, "No node found");
    return this.getEdges().filter((e) => e.getFromId() === aNode.getId());
  }
  getEdge(a: Node | NodeId, b: Node | NodeId): Edge | undefined {
    const aNode = typeof a === "object" ? a : this.getNodeById(a);
    const bNode = typeof b === "object" ? b : this.getNodeById(b);
    const edgeId = this.#graph.getEdgeId(aNode.id, bNode.id);
    return this.#edges[edgeId];
  }
  getEdgeById(edgeId: EdgeId) {
    return this.#edges[edgeId];
  }
  getSourceNodeIds() {
    return [...this.#sourceNodes];
  }
}

export default CampaignGraph;
