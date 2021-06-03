import AbstractNode from "../nodes/abstractNode";
import { Operators } from "../operators";
import { ComparatorKind, NodeKind, OP_MAP } from "../syntaxKind";

abstract class AbstractComparatorNode extends AbstractNode {
  nodeKind: NodeKind.Comparator = NodeKind.Comparator;
  abstract comparatorKind: ComparatorKind;
  operator: Operators | undefined;
  toString() {
    return OP_MAP[this.operator as Operators];
  }
}

export default AbstractComparatorNode;
