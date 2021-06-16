import { CampaignNodeKind } from "../types";
import { v4 as uuidv4 } from "uuid";

abstract class AbstractCampaignNode {
  abstract kind: CampaignNodeKind;
  id: string;
  constructor() {
    this.id = uuidv4();
  }
  toString() {
    throw new Error("toString function not implemented");
  }
  setId(id: string) {
    this.id = id;
    return this;
  }
  getId() {
    return this.id;
  }
}

export default AbstractCampaignNode;
