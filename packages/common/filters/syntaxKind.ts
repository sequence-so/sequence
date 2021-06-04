import AbstractComparatorNode from "./comparators/abstractComparatorNode";
import {
  AbstractNode,
  AttributeFilterNode,
  ConditionNode,
  EmailFilterNode,
  EventAttributeNode,
  EventFilterNode,
  PageFilterNode,
} from "./nodes";
import { Operators } from "./operators";

export enum NodeKind {
  Condition = "Condition",
  Filter = "Filter",
  Comparator = "Comparator",
  Expectation = "Expectation",
}

export enum FilterKind {
  Email = "Email",
  Event = "Event",
  UserAttribute = "UserAttribute",
  Page = "Page",
  EventAttribute = "EventAttribute",
}

export enum ComparatorKind {
  String = "String",
  Date = "Date",
  Number = "Number",
  IsTimestamp = "IsTimestamp",
}

export enum SyntaxKind {
  Abstract = "Abstract",
  Condition = "Condition",
  BeginCondition = "BeginCondition",
  AttributeFilterNode = "AttributeFilterNode",
  ValueNode = "ValueNode",
  EmailFilterNode = "EmailFilterNode",
  Done = "Done",
  EndOperand = "EndOperand",
  EndCondition = "EndCondition",
}

export enum ConditionNodeKind {
  AND = "AND",
  OR = "OR",
}

export enum DateNodeKind {
  ABSOLUTE = "ABSOLUTE",
  RELATIVE = "RELATIVE",
  IS_TIMESTAMP = "IS_TIMESTAMP",
}

export const DATE_NOW = "$now";

export interface NodeParseError {
  id: string;
  error: string;
}

export type BASE_QUERY = {
  model?: string;
  as?: string;
  required?: boolean;
  where?: Record<string, any>;
  include?: any[];
};

export const OP_MAP = {
  [Operators.eq]: "is equal to",
  [Operators.gt]: "is greater than",
  [Operators.gte]: "is greater than or equal to",
  [Operators.lt]: "is less than",
  [Operators.lte]: "is less than or equal to",
  [Operators.and]: "and",
  [Operators.or]: "or",
  [Operators.ne]: "ne",
  [Operators.like]: "like",
  [Operators.between]: "between",
};

export interface NodeVisitor {
  onBeginCondition: (node: ConditionNode) => void;
  onComparatorNode: (
    comparator: AbstractComparatorNode,
    node: AbstractNode
  ) => void;
  onEmailNode: (node: EmailFilterNode) => void;
  onEndCondition: (node: ConditionNode, hasMore?: boolean) => void;
  onEndOperand: () => void;
  onEventAttributeNode: (node: EventAttributeNode) => void;
  onEventNode: (node: EventFilterNode) => void;
  onPageFilterNode: (node: PageFilterNode) => void;
  onUserAttributeNode: (node: AttributeFilterNode) => void;
}

export default SyntaxKind;
