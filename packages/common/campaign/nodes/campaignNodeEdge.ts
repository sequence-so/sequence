import { EdgeType } from "../types";
import AbstractCampaignNode from "./abstractCampaignNode";
import { v4 as uuidv4 } from "uuid";

/**
 * Represents a connection between two Campaign Nodes.
 */
class CampaignNodeEdge {
  #id: string;
  #from: AbstractCampaignNode;
  #to: AbstractCampaignNode;
  #edgeType: EdgeType;
  private constructor(
    from?: AbstractCampaignNode,
    to?: AbstractCampaignNode,
    edgeType?: EdgeType
  ) {
    this.#id = uuidv4();
    this.#from = from;
    this.#to = to;
    this.#edgeType = edgeType;
  }
  static new(
    from?: AbstractCampaignNode,
    to?: AbstractCampaignNode,
    edgeType?: EdgeType
  ) {
    return new CampaignNodeEdge(from, to, edgeType);
  }
  getId() {
    return this.#id;
  }
  setId(value: string) {
    this.#id = value;
    return this;
  }
  getFrom() {
    return this.#from;
  }
  setFrom(value: AbstractCampaignNode) {
    this.#from = value;
    return this;
  }
  getTo() {
    return this.#to;
  }
  setTo(value: AbstractCampaignNode) {
    this.#to = value;
    return this;
  }
  getEdgeType() {
    return this.#edgeType;
  }
  setEdgeType(edgeType: EdgeType) {
    this.#edgeType = edgeType;
    return this;
  }
}

export default CampaignNodeEdge;
