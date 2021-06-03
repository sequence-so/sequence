import AbstractFilterNode from "./abstractFilterNode";
import AbstractComparatorNode from "../comparators/abstractComparatorNode";
import { FilterKind, NodeKind } from "../syntaxKind";

class EmailFilterNode extends AbstractFilterNode {
  filterKind = FilterKind.Email;
  mailName: string | undefined;
  expected: any;
  clicked: boolean | undefined;
  opened: boolean | undefined;
  sent: boolean | undefined;
  private constructor(mailName: any) {
    super("name", mailName);
  }
  static new(mailName: string) {
    return new EmailFilterNode(mailName);
  }
  hasBeenClicked() {
    if (typeof this.clicked !== "undefined") {
      throw new Error("The property `clicked` has already been set.");
    }
    this.clicked = true;
    return this;
  }
  hasNotBeenClicked() {
    if (typeof this.clicked !== "undefined") {
      throw new Error("The property `clicked` has already been set.");
    }
    this.clicked = false;
  }
  hasBeenOpened() {
    if (typeof this.opened !== "undefined") {
      throw new Error("The property `opened` has already been set.");
    }
    this.opened = true;
    return this;
  }
  hasNotBeenOpened() {
    if (typeof this.opened !== "undefined") {
      throw new Error("The property `opened` has already been set.");
    }
    this.opened = false;
  }
  hasBeenSent() {
    if (typeof this.sent !== "undefined") {
      throw new Error("The property `sent` has already been set.");
    }
    this.sent = true;
    return this;
  }
  hasNotBeenSent() {
    if (typeof this.sent !== "undefined") {
      throw new Error("The property `sent` has already been set.");
    }
    this.sent = false;
  }
  toString() {
    let label = `Event`;
    if (this.attribute) {
      label += `.${this.attribute}`;
    }
    if (this.comparator) {
      label += `.${this.comparator?.toString()}.${this.expected}`;
    }
    if (typeof this.opened !== "undefined") {
      label +=
        typeof this.opened !== "undefined"
          ? ".has been opened"
          : ".has not been opened";
    }
    if (typeof this.clicked !== "undefined") {
      label +=
        typeof this.clicked !== "undefined"
          ? ".has been clicked"
          : ".has not been clicked";
    }
    return label;
  }
}

export default EmailFilterNode;
