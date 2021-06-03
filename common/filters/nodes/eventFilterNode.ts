import AbstractFilterNode from "./abstractFilterNode";
import AbstractComparatorNode from "../comparators/abstractComparatorNode";
import { FilterKind, NodeKind } from "../syntaxKind";

class EventNode extends AbstractFilterNode {
  nodeKind: NodeKind.Filter = NodeKind.Filter;
  filterKind: FilterKind.Event = FilterKind.Event;
  expected: any;
  performed: boolean | undefined;
  private constructor(eventName?: string) {
    super("name", eventName);
    this.equals(eventName);
  }
  static new(eventName?: string) {
    return new EventNode(eventName);
  }
  get table() {
    return "events";
  }
  getFilterOptions() {
    return [
      {
        label: "has been performed",
        value: "hasBeenPerformed",
      },
      {
        label: "has not been performed",
        value: "hasNotBeenPerformed",
      },
    ];
  }
  hasBeenPerformed() {
    return this.setPerformed(true);
  }
  hasNotBeenPerformed() {
    return this.setPerformed(false);
  }
  setPerformed(value: boolean | undefined) {
    this.performed = value;
    return this;
  }
  toString() {
    let label = `Event`;
    if (this.attribute) {
      label += `.${this.attribute}`;
    }
    if (this.comparator) {
      label += `.${this.comparator?.toString()}.${this.expected}`;
    }
    if (typeof this.performed !== "undefined") {
      label +=
        typeof this.performed !== "undefined"
          ? ".has been performed"
          : ".has not been performed";
    }
    return label;
  }
}

export default EventNode;
