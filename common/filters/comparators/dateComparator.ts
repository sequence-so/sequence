import { Operators } from "../operators";
import { ComparatorKind } from "../syntaxKind";
import AbstractComparatorNode from "./abstractComparatorNode";

class DateComparator extends AbstractComparatorNode {
  comparatorKind = ComparatorKind.Date;
  private constructor(operator: Operators) {
    super();
    this.operator = operator;
  }
  static new(operator: Operators) {
    return new DateComparator(operator);
  }
}

export default DateComparator;
