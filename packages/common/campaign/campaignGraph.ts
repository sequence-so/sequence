import invariant from "invariant";
import Graph, { GraphInstance } from "sequence-graph-data-structure";
import AbstractCampaignNode from "./nodes/abstractCampaignNode";
import { Edge } from "./nodes";
import { EdgeType } from "./types";

type Node = AbstractCampaignNode;
type NodeId = string;
type EdgeId = string;
interface SerializedCampaignGraph {}

/**
 * Contains data about the nodes in a Campaign in a queryable format.
 */
class CampaignGraph {
  userId: string;
  #graph: GraphInstance;
  #nodes: Record<NodeId, Node>;
  #edges: Record<EdgeId, Edge>;

  constructor(userId?: string) {
    this.userId = userId;
    this.#graph = Graph();
    this.#nodes = {};
    this.#edges = {};
  }
  addNode(node: Node) {
    this.#nodes[node.id] = node;
    this.#graph.addNode(node.id);
  }
  addNodes(...nodes: Node[]) {
    nodes.forEach((n) => this.addNode(n));
  }
  addEdge(
    a: Node | NodeId,
    b: Node | NodeId,
    edgeType: EdgeType = EdgeType.DEFAULT,
    edgeId?: string
  ) {
    const aNode = typeof a === "object" ? a : this.#nodes[a];
    const bNode = typeof b === "object" ? b : this.#nodes[b];
    if (typeof a === "string") {
      invariant(
        aNode,
        `Using the string identifier to create an edge requires that Node "${a}" first be added via CampaignGraph.addNode`
      );
    }
    if (typeof b === "string") {
      invariant(
        bNode,
        `Using the string identifier to create an edge requires that Node "${b}" first be added via CampaignGraph.addNode`
      );
    }
    const edge = Edge.new(aNode, bNode, edgeType);
    if (edgeId) {
      edge.setId(edgeId);
    }
    this.#graph.addEdge(aNode.id, bNode.id, edgeType, edge.getId());
    this.#edges[edge.getId()] = edge;
    return edge;
  }
  getNodeById(id: NodeId) {
    return this.#nodes[id];
  }
  removeEdge(a: Node | NodeId, b: Node | NodeId): boolean {
    const aNode = typeof a === "object" ? a : this.#nodes[a];
    const bNode = typeof b === "object" ? b : this.#nodes[b];
    const edgeId = this.#graph.getEdgeId(aNode.id, bNode.id);
    if (edgeId) {
      delete this.#edges[edgeId];
      this.#graph.removeEdge(aNode.id, bNode.id);
      return true;
    }
    return false;
  }
  removeNode(node: Node) {
    delete this.#nodes[node.id];
    this.#graph.removeNode(node.id);
  }
  hasCycle() {
    this.#graph.hasCycle();
  }
  getCycles() {
    this.#graph.getCycles();
  }
  getEdge(a: Node | NodeId, b: Node | NodeId) {
    const aNode = typeof a === "object" ? a : this.getNodeById(a);
    const bNode = typeof b === "object" ? b : this.getNodeById(b);
    const edgeId = this.#graph.getEdgeId(aNode.id, bNode.id);
    return this.#edges[edgeId];
  }
  getEdgeById(edgeId: EdgeId) {
    return this.#edges[edgeId];
  }
  serialize() {
    const serialized = {};
    const result = this.#graph.serialize();
    result.links;
  }
}

export default CampaignGraph;
