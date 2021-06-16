import Graph, { GraphInstance } from "sequence-graph-data-structure";
import AbstractCampaignNode from "./nodes/abstractCampaignNode";

type Node = AbstractCampaignNode;

/**
 * Contains data about the nodes in a Campaign in a queryable format.
 */
class CampaignGraph {
  userId: string;
  #graph: GraphInstance;
  #nodes: Record<string, Node>;

  constructor(userId?: string) {
    this.userId = userId;
    this.#graph = Graph();
    this.#nodes = {};
  }
  addNode(node: Node) {
    this.#nodes[node.id] = node;
    this.#graph.addNode(node.id);
  }
  addEdge(a: Node | string, b: Node) {
    if (typeof a === "string") {
      this.#graph.addEdge(a, b.id);
    } else {
      this.#graph.addEdge(a.id, b.id);
    }
  }
  removeEdge(a: Node, b: Node) {
    this.#graph.removeEdge(a.id, b.id);
  }
  removeNode(node: Node) {
    delete node.id;
    this.#graph.removeNode(node.id);
  }
  hasCycle() {
    this.#graph.hasCycle();
  }
  getCycles() {
    this.#graph.getCycles();
  }
}

export default CampaignGraph;
