import {
  SerializedComparatorNode,
  SerializedEventAttributeNode,
  SerializedEventFilter,
  SerializedConditionNode,
  SerializedAttributeFilter,
} from ".";
import AbstractComparatorNode from "../comparators/abstractComparatorNode";
import {
  AttributeFilterNode,
  ConditionNode,
  EmailFilterNode,
  EventAttributeNode,
  EventFilterNode,
  PageFilterNode,
} from "../nodes";
import { Operators } from "../operators";
import { visit } from "../parse";
import { ConditionNodeKind, NodeKind, NodeVisitor } from "../syntaxKind";

export const serializeComparator = (
  node: AbstractComparatorNode
): SerializedComparatorNode => {
  return {
    id: node.id,
    comparatorKind: node.comparatorKind,
    operator: node.operator!,
    nodeKind: node.nodeKind,
  };
};

export const serializeEventFilterNode = (
  node: EventFilterNode
): SerializedEventFilter => {
  return {
    id: node.id,
    nodeKind: node.nodeKind,
    filterKind: node.filterKind,
    expected: node.expected,
    performed: node.performed,
    attribute: node.attribute || null,
    comparator: serializeComparator(node.comparator!),
  };
};

export const serializeEventAttributeNode = (
  node: EventAttributeNode
): SerializedEventAttributeNode => {
  return {
    id: node.id,
    nodeKind: node.nodeKind,
    filterKind: node.filterKind,
    eventName: node.eventName,
    expected: node.expected,
    attribute: node.attribute || null,
    comparator: serializeComparator(node.comparator!),
  };
};

export const serializeConditionNode = (
  node: ConditionNode
): SerializedConditionNode => {
  return {
    id: node.id,
    nodeKind: node.nodeKind,
    children: [],
    conditionKind: node.conditionKind,
    operator: node.operator,
  };
};

export const serializeAttributeNode = (
  node: AttributeFilterNode
): SerializedAttributeFilter => {
  return {
    id: node.id,
    nodeKind: node.nodeKind,
    attribute: node.attribute || null,
    comparator: serializeComparator(node.comparator!),
    expected: node.expected,
    filterKind: node.filterKind,
  };
};

export const serialize = (root: ConditionNode) => {
  let builder: SerializedConditionNode = {
    children: [],
    nodeKind: NodeKind.Condition,
    conditionKind: ConditionNodeKind.AND,
    id: "root",
    operator: Operators.and,
  };
  let parents: SerializedConditionNode[] = [builder];

  const visitor: NodeVisitor = {
    onBeginCondition(node: ConditionNode) {
      const nextBuilder = serializeConditionNode(node);
      builder.children.push(nextBuilder);
      parents.push(builder);
      builder = nextBuilder;
    },
    onComparatorNode(node: AbstractComparatorNode) {},
    onEndCondition(node: ConditionNode) {
      builder = parents.pop()!;
    },
    onEndOperand: () => {},
    onEventNode: (node: EventFilterNode) => {
      builder.children.push(serializeEventFilterNode(node));
    },
    onEmailNode: (node: EmailFilterNode) => {},
    onPageFilterNode: (node: PageFilterNode) => {},
    onEventAttributeNode: (node: EventAttributeNode) => {
      builder.children.push(serializeEventAttributeNode(node));
    },
    onUserAttributeNode: (node: AttributeFilterNode) => {
      builder.children.push(serializeAttributeNode(node));
    },
  };

  visit(root, visitor);
  return builder.children[0];
};
