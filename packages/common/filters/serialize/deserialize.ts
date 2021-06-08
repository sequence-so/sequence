import {
  SerializedComparatorNode,
  SerializedConditionNode,
  SerializedAbstractNode,
  SerializedValueNode,
} from ".";
import { Condition } from "..";
import DateComparator from "../comparators/dateComparator";
import StringComparator from "../comparators/stringComparator";
import IsTimestampComparatorNode from "../date/isTimestampDateNode";
import {
  AbstractNode,
  AttributeFilterNode,
  EmailFilterNode,
  EventAttributeNode,
  EventFilterNode,
  PageFilterNode,
} from "../nodes";
import {
  ComparatorKind,
  ConditionNodeKind,
  FilterKind,
  NodeKind,
} from "../syntaxKind";

export const deserializeComparator = (node: SerializedComparatorNode) => {
  switch (node.comparatorKind) {
    case ComparatorKind.String:
    case ComparatorKind.Number:
      return StringComparator.new(node.operator!);
    case ComparatorKind.Date:
      return DateComparator.new(node.operator!);
    case ComparatorKind.IsTimestamp:
      return IsTimestampComparatorNode.new();
  }
};

const deserializeChildren = (
  nodes: SerializedAbstractNode[]
): AbstractNode[] => {
  return nodes.map((n) => deserializeAbstractNode(n));
};

export const deserializeCondition = (node: SerializedConditionNode) => {
  switch (node.conditionKind) {
    case ConditionNodeKind.AND:
      return Condition.and()
        .setChildren(deserializeChildren(node.children))
        .setId(node.id);
    case ConditionNodeKind.OR:
      return Condition.or()
        .setChildren(deserializeChildren(node.children))
        .setId(node.id);
  }
};

export const deserializeValue = (node: SerializedValueNode) => {
  switch (node.filterKind) {
    case FilterKind.Event:
      return EventFilterNode.new(node.expected!)
        .setComparator(deserializeComparator(node.comparator))
        .setPerformed(node.performed)
        .setId(node.id)
        .setComparatorId(node.comparator.id);
    case FilterKind.Email:
      return EmailFilterNode.new(node.attribute!)
        .setId(node.id)
        .setComparatorId(node.comparator.id);
    case FilterKind.EventAttribute:
      return EventAttributeNode.new(node.eventName!)
        .setAttribute(node.attribute!)
        .setExpected(node.expected)
        .setComparator(deserializeComparator(node.comparator))
        .setId(node.id)
        .setComparatorId(node.comparator.id);
    case FilterKind.Page:
      return PageFilterNode.new()
        .setId(node.id)
        .setComparatorId(node.comparator.id);
    case FilterKind.UserAttribute:
      return AttributeFilterNode.new(node.attribute!, node.expected)
        .setComparator(deserializeComparator(node.comparator))
        .setId(node.id)
        .setComparatorId(node.comparator.id);
  }
};

export const deserializeAbstractNode = (node: SerializedAbstractNode) => {
  switch (node.nodeKind) {
    case NodeKind.Comparator:
      return deserializeComparator(node as SerializedComparatorNode);
    case NodeKind.Condition:
      return deserializeCondition(node as SerializedConditionNode);
    case NodeKind.Filter:
      return deserializeValue(node as SerializedValueNode);
  }
};

export const deserialize = (root: SerializedConditionNode) => {
  return deserializeCondition(root);
};
