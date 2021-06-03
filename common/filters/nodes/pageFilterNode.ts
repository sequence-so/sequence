import AbstractFilterNode from "./abstractFilterNode";
import AbstractComparatorNode from "../comparators/abstractComparatorNode";
import StringComparator from "../comparators/stringComparator";
import { Operators } from "../operators";
import { FilterKind, NodeKind } from "../syntaxKind";

class PageFilterNode extends AbstractFilterNode {
  filterKind = FilterKind.Page;
  expected: any;
  viewed: boolean | undefined;
  private constructor(attribute?: string, expected?: any) {
    super(attribute, expected);
  }
  static new(attribute?: string, expected?: any) {
    return new PageFilterNode(attribute, expected);
  }
  contains(str: string) {
    this.comparator = StringComparator.new(Operators.like);
    this.expected = str;
    return this;
  }
  hasBeenViewed() {
    if (typeof this.viewed !== "undefined") {
      throw new Error("The property `viewed` has already been set.");
    }
    this.viewed = true;
    return this;
  }
  hasNotBeenViewed() {
    if (typeof this.viewed !== "undefined") {
      throw new Error("The property `viewed` has already been set.");
    }
    this.viewed = false;
    return this;
  }
  toString() {
    let label = `Page`;
    if (this.attribute) {
      label += `.${this.attribute}`;
    }
    if (this.comparator) {
      label += `.${this.comparator?.toString()}.${this.expected}`;
    }
    if (typeof this.viewed !== "undefined") {
      label +=
        typeof this.viewed !== "undefined"
          ? ".has been viewed"
          : ".has not been viewed";
    }
    return label;
  }
}

export default PageFilterNode;
