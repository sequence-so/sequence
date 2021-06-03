import AbstractFilterNode from "./abstractFilterNode";
import { FilterKind, NodeKind } from "../syntaxKind";

class EventAttributeNode extends AbstractFilterNode {
  nodeKind: NodeKind.Filter = NodeKind.Filter;
  filterKind: FilterKind.EventAttribute = FilterKind.EventAttribute;
  eventName: string | undefined;
  expected: any;
  performed: boolean | undefined;
  private constructor(eventName?: any) {
    super("name", eventName);
  }
  static new(eventName?: string) {
    return new EventAttributeNode(eventName);
  }
  get table() {
    return "events";
  }
  setPerformed(performed: boolean | undefined) {
    this.performed = performed;
    return this;
  }
  toString() {
    let label = `EventAttribute`;
    if (this.attribute) {
      label += `.${this.attribute}`;
    }
    if (this.comparator) {
      label += `.${this.comparator?.toString()}.${this.expected}`;
    }

    return label;
  }
}

export default EventAttributeNode;
