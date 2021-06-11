import AbstractComparatorNode from "../comparators/abstractComparatorNode";
import IsTimestampComparatorNode from "../date/isTimestampDateNode";
import { EventAttributeNode, EventFilterNode } from "../nodes";
import AbstractFilterNode from "../nodes/abstractFilterNode";
import AbstractNode from "../nodes/abstractNode";
import AttributeFilterNode from "../nodes/attributeFilterNode";
import ConditionNode from "../nodes/conditionNode";
import EmailFilterNode from "../nodes/emailFilterNode";
import {
  ComparatorKind,
  NodeParseError,
  NodeVisitor,
  OP_MAP,
} from "../syntaxKind";
import visit from "./visit";

const MAX_DEPTH = 5;

export const MAX_CONDITION_DEPTH_REACHED =
  "You have too many nested conditions.";
export const EMPTY_CONDITION = "Condition has no filters to match on";
export const EMPTY_ATTRIBUTE = "Specify an attribute to match on";
export const EMPTY_EXPECTATION = "Specify a value to match on";
export const EMPTY_EVENT = "Specify an event to match on";
export const EVENT_ATTRIBUTE_MUST_BE_NAME =
  "Attribute must be `name` for this filter";
export const EMPTY_EVENT_PERFORMED =
  "Specify the match criteria for this event";
export const EMPTY_OPERATOR = "Specify a match operator";
export const OPERATOR_NOT_FOUND =
  "Strings and numbers cannot match using this operator";

const parse = (node: AbstractNode, errors: NodeParseError[]) => {
  let depth = 0;
  let currNode: AbstractNode;

  const newParseError = (message: string, node: AbstractNode): void => {
    errors.push({
      id: node.id,
      error: message,
    });
  };

  const visitor: NodeVisitor = {
    onBeginCondition(node: ConditionNode) {
      depth++;
      if (depth >= MAX_DEPTH) {
        return newParseError(MAX_CONDITION_DEPTH_REACHED, node);
      }
    },
    onPageFilterNode() {},
    onEndCondition(node: ConditionNode) {},
    onEmailNode(node: EmailFilterNode) {},
    onEndOperand: () => {},
    onUserAttributeNode: (node: AttributeFilterNode) => {
      if (!node.attribute) {
        return newParseError(EMPTY_ATTRIBUTE, node);
      }
      if (typeof node.expected === "undefined") {
        return newParseError(EMPTY_EXPECTATION, node);
      }
    },
    onEventNode: (node: EventFilterNode) => {
      // this can only happen by modifying the `attribute` value via code
      if (node.attribute !== "name") {
        return newParseError(EVENT_ATTRIBUTE_MUST_BE_NAME, node);
      }
      if (typeof node.performed === "undefined") {
        return newParseError(EMPTY_EVENT_PERFORMED, node);
      }
    },
    onComparatorNode: (
      comparator: AbstractComparatorNode,
      node: AbstractNode
    ) => {
      if (!comparator?.operator) {
        return newParseError(EMPTY_OPERATOR, node);
      }
      switch (comparator.comparatorKind) {
        case ComparatorKind.String:
        case ComparatorKind.Number:
          if (typeof comparator.operator === "undefined") {
            return newParseError(OPERATOR_NOT_FOUND, node);
          }
          break;
        case ComparatorKind.IsTimestamp:
          (comparator as IsTimestampComparatorNode).operator;
        default:
          return;
      }
    },
    onEventAttributeNode: (node: EventAttributeNode) => {
      if (!node.attribute) {
        return newParseError(EMPTY_ATTRIBUTE, node);
      }
      if (typeof node.expected === "undefined") {
        return newParseError(EMPTY_EXPECTATION, node);
      }
    },
  };
  visit(node, visitor);
};

export default parse;
