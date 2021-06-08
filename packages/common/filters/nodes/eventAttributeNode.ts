import AbstractFilterNode from "./abstractFilterNode";
import { FilterKind, NodeKind } from "../syntaxKind";

class EventAttributeNode extends AbstractFilterNode {
  nodeKind: NodeKind.Filter = NodeKind.Filter;
  filterKind: FilterKind.EventAttribute = FilterKind.EventAttribute;
  eventName: string | undefined;
  expected: any;
  private constructor(eventName?: any) {
    super("name");
    this.eventName = eventName;
  }
  static new(eventName?: string) {
    return new EventAttributeNode(eventName);
  }
  get table() {
    return "events";
  }
  public setAttribute(attribute: string) {
    this.attribute = attribute;
    return this;
  }
  public setExpected(expected: any) {
    this.expected = expected;
    return this;
  }
  public toString() {
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
