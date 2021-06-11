import { EdgeKind } from "../types";
import { v4 as uuidv4 } from "uuid";

/**
 * Represents a connection between two Campaign Nodes.
 */
class CampaignNodeEdge {
  #id: string;
  #fromId?: string;
  #toId?: string;
  #edgeKind?: EdgeKind;
  private constructor(from?: string, to?: string, edgeKind?: EdgeKind) {
    this.#id = uuidv4();
    this.#fromId = from;
    this.#toId = to;
    this.#edgeKind = edgeKind || EdgeKind.Default;
  }
  static new(fromId?: string, toId?: string, edgeKind?: EdgeKind) {
    return new CampaignNodeEdge(fromId, toId, edgeKind);
  }
  getId() {
    return this.#id;
  }
  setId(value: string) {
    this.#id = value;
    return this;
  }
  getFromId() {
    return this.#fromId;
  }
  setFromId(value: string) {
    this.#fromId = value;
    return this;
  }
  getToId() {
    return this.#toId;
  }
  setToId(value: string) {
    this.#toId = value;
    return this;
  }
  getEdgeKind() {
    return this.#edgeKind;
  }
  setEdgeKind(edgeKind: EdgeKind) {
    this.#edgeKind = edgeKind;
    return this;
  }
}

export default CampaignNodeEdge;
