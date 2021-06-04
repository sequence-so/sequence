import { Operators } from "../operators";
import { ComparatorKind } from "../syntaxKind";
import AbstractComparatorNode from "./abstractComparatorNode";

class DateTypeComparator extends AbstractComparatorNode {
  value: boolean;
  comparatorKind = ComparatorKind.IsTimestamp;
  attributeName: string;
  private constructor(attributeName: string, validateIsDate: boolean) {
    super();
    this.operator = Operators.eq;
    this.value = validateIsDate;
    this.attributeName = attributeName;
  }
  static new(attributeName: string, validateIsDate: boolean) {
    return new DateTypeComparator(attributeName, validateIsDate);
  }
}

export default DateTypeComparator;
