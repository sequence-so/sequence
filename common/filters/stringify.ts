import AbstractComparatorNode from "./comparators/abstractComparatorNode";
import {
  AbstractFilterNode,
  AbstractNode,
  AttributeFilterNode,
  ConditionNode,
  EmailFilterNode,
  EventFilterNode,
  PageFilterNode,
} from "./nodes";
import { visit } from "./parse";
import { NodeVisitor } from "./syntaxKind";

const stringify = (node: AbstractNode) => {
  let str = "";
  let indent = "  ";
  let depth = 0;
  const visitor: NodeVisitor = {
    onBeginCondition(node: ConditionNode) {
      str += indent.repeat(depth) + node.toString() + "[\n";
      depth++;
    },
    onComparatorNode(node: AbstractComparatorNode) {},
    onEndCondition(node: ConditionNode) {
      depth--;
      str += indent.repeat(depth) + "],\n";
    },
    onEndOperand: () => {
      str += ",\n";
    },
    onEventNode: (node: EventFilterNode) => {
      str += indent.repeat(depth) + node.toString();
    },
    onUserAttributeNode(node: AttributeFilterNode) {
      str += indent.repeat(depth) + node.toString();
    },
    onEmailNode: (node: EmailFilterNode) => {
      str += indent.repeat(depth) + node.toString();
    },
    onPageFilterNode: (node: PageFilterNode) => {
      str += indent.repeat(depth) + node.toString();
    },
    onEventAttributeNode: (node: AbstractFilterNode) => {
      str += indent.repeat(depth) + node.toString();
    },
  };
  visit(node, visitor);
  return str;
};

export default stringify;
