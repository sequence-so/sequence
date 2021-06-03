import AbstractNode from "../nodes/abstractNode";
import { DateNodeKind, NodeKind } from "../syntaxKind";

abstract class AbstractDateNode extends AbstractNode {
  nodeKind = NodeKind.Expectation;
  abstract dateKind: DateNodeKind;
  reference: string | Date | undefined;
}

export default AbstractDateNode;
