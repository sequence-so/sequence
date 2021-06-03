import AbstractComparatorNode from "../comparators/abstractComparatorNode";
import {
  AbstractFilterNode,
  AbstractNode,
  AttributeFilterNode,
  ConditionNode,
  EmailFilterNode,
  EventAttributeNode,
  EventFilterNode,
  PageFilterNode,
} from "../nodes";
import SyntaxKind, { FilterKind, NodeVisitor } from "../syntaxKind";
import createScanner from "./scanner";

const visit = (node: AbstractNode, visitor: NodeVisitor) => {
  const scanner = createScanner(node);

  function parseCondition(): boolean {
    visitor.onBeginCondition(scanner.getNode() as ConditionNode);
    scanner.scan();

    while (
      scanner.getToken() !== SyntaxKind.EndCondition &&
      scanner.getToken() !== SyntaxKind.Done
    ) {
      if (scanner.getToken() === SyntaxKind.EndOperand) {
        visitor.onEndOperand();
        scanner.scan();
      }
      if (!parseValue()) {
        // handleError(ParseErrorCode.ValueExpected);
      }
    }
    visitor.onEndCondition(scanner.getNode() as ConditionNode);
    scanner.scan();
    return true;
  }

  function parseNode(): boolean {
    const node = scanner.getNode() as AbstractFilterNode;
    switch (node.filterKind) {
      case FilterKind.Email:
        visitor.onEmailNode(node as EmailFilterNode);
        break;
      case FilterKind.Event:
        visitor.onEventNode(node as EventFilterNode);
        break;
      case FilterKind.EventAttribute:
        visitor.onEventAttributeNode(node as EventAttributeNode);
        break;
      case FilterKind.Page:
        visitor.onPageFilterNode(node as PageFilterNode);
        break;
      case FilterKind.UserAttribute:
        visitor.onUserAttributeNode(node as AttributeFilterNode);
        break;
      default:
        throw new Error("Unexpected node type found:" + node.filterKind);
    }

    visitor.onComparatorNode(node.comparator as AbstractComparatorNode, node);

    scanner.scan();
    return true;
  }

  function parseValue(): boolean {
    const token = scanner.getToken();
    switch (token) {
      case SyntaxKind.BeginCondition:
        return parseCondition();
      case SyntaxKind.ValueNode:
        return parseNode();
      default:
        return false;
    }
  }

  scanner.scan();
  if (!parseValue()) {
    throw new Error("No values found");
  }
  if (scanner.getToken() !== SyntaxKind.Done) {
    throw new Error("Expected end of input");
  }
  return true;
};

export default visit;
