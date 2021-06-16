import { CampaignNodeKind } from "../types";
import { v4 as uuidv4 } from "uuid";

abstract class AbstractCampaignNode {
  abstract kind: CampaignNodeKind;
  id: string;
  name: string | undefined;
  positionX: number;
  positionY: number;
  json?: any;
  timeoutAfter?: number;
  constructor() {
    this.id = uuidv4();
    this.positionX = 0;
    this.positionY = 0;
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
  setName(value: string) {
    this.name = value;
    return this;
  }
  getName() {
    return this.name;
  }
  setPositionX(value: number) {
    this.positionX = value;
    return this;
  }
  getPositionX() {
    return this.positionX;
  }
  setPositionY(value: number) {
    this.positionY = value;
    return this;
  }
  getPositionY() {
    return this.positionY;
  }
}

export default AbstractCampaignNode;
