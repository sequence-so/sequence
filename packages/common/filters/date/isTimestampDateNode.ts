import AbstractComparatorNode from "../comparators/abstractComparatorNode";
import { ComparatorKind, DateNodeKind } from "../syntaxKind";

class IsTimestampComparatorNode extends AbstractComparatorNode {
  dateKind = DateNodeKind.IS_TIMESTAMP;
  comparatorKind = ComparatorKind.IsTimestamp;
  private constructor() {
    super();
  }
  static new() {
    return new IsTimestampComparatorNode();
  }
}

export default IsTimestampComparatorNode;
