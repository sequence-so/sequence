import { DateNodeKind } from "../syntaxKind";
import AbstractDateNode from "./abstractDateNode";

class RelativeDateNode extends AbstractDateNode {
  dateKind: DateNodeKind = DateNodeKind.RELATIVE;
  days: number;
  private constructor(days: number, reference?: Date | "$now") {
    super();
    this.days = days;
    this.reference = reference;
  }
  static from(days: number, date: Date | "$now" = "$now") {
    return new RelativeDateNode(days, date);
  }
  toString() {
    return `.${this.days} days.${
      this.reference === "now"
        ? "from now"
        : "from " + this.reference?.toString()
    }`;
  }
}

export default RelativeDateNode;
