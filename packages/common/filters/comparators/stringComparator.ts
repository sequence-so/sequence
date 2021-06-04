import { Operators } from "../operators";
import { ComparatorKind } from "../syntaxKind";
import AbstractComparator from "./abstractComparatorNode";

class StringComparator extends AbstractComparator {
  comparatorKind = ComparatorKind.String;
  private constructor(operator: Operators) {
    super();
    this.operator = operator;
  }
  static new(operator: Operators) {
    return new StringComparator(operator);
  }
}

export default StringComparator;
