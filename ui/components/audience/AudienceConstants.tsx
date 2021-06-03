import {
  AttributeFilter,
  Condition,
  ConditionNodeKind,
  EventAttribute,
  EventFilter,
  FilterKind,
  NodeKind,
} from "common/filters";
import { AbstractFilterNode, AbstractNode } from "common/filters/nodes";

export const NODE_OPTION_OR = {
  value: ConditionNodeKind.OR,
  label: "Or Group",
};
export const NODE_OPTION_AND = {
  value: ConditionNodeKind.AND,
  label: "And Group",
};
export const NODE_OPTION_EVENT = {
  value: FilterKind.Event,
  label: "Event",
};
export const NODE_OPTION_EVENT_ATTRIBUTE = {
  value: FilterKind.EventAttribute,
  label: "Event Attribute",
};
export const NODE_OPTION_USER_ATTRIBUTE = {
  value: FilterKind.UserAttribute,
  label: "User Attribute",
};

export const DEFAULT_OPERATOR_VALUE = {
  label: "Equals",
  value: "equals",
  args: 1,
};

export const mapCreateFilterToNode = (value: string) => {
  if (value === ConditionNodeKind.OR) {
    return Condition.or();
  } else if (value === ConditionNodeKind.AND) {
    return Condition.and();
  } else if (value === FilterKind.Event) {
    return EventFilter.new();
  } else if (value === FilterKind.UserAttribute) {
    return AttributeFilter.new();
  } else if (value === FilterKind.EventAttribute) {
    return EventAttribute.new();
  }
};

export const ROOT_SELECT_OPTIONS = [
  { value: ConditionNodeKind.AND, label: "All" },
  { value: ConditionNodeKind.OR, label: "One of" },
];

export const SELECT_OPTIONS = [
  NODE_OPTION_AND,
  NODE_OPTION_OR,
  NODE_OPTION_EVENT,
  NODE_OPTION_EVENT_ATTRIBUTE,
  NODE_OPTION_USER_ATTRIBUTE,
];

export const mapNodeKindToSelectOption = (value: AbstractNode) => {
  if (value.nodeKind === NodeKind.Condition && (value as Condition).isOr()) {
    return NODE_OPTION_AND;
  } else if (
    value.nodeKind === NodeKind.Condition &&
    (value as Condition).isAnd()
  ) {
    return NODE_OPTION_AND;
  } else if (
    value.nodeKind === NodeKind.Filter &&
    (value as AbstractFilterNode).filterKind === FilterKind.Event
  ) {
    return NODE_OPTION_EVENT;
  } else if (
    value.nodeKind === NodeKind.Filter &&
    (value as AbstractFilterNode).filterKind === FilterKind.EventAttribute
  ) {
    return NODE_OPTION_EVENT_ATTRIBUTE;
  } else if (
    value.nodeKind === NodeKind.Filter &&
    (value as AbstractFilterNode).filterKind === FilterKind.UserAttribute
  ) {
    return NODE_OPTION_USER_ATTRIBUTE;
  }
};

export const getOptionsForNodeType = (node: AbstractFilterNode) => {
  if (node.filterKind === FilterKind.Event) {
    return [
      {
        label: "My First Event",
        value: "My First Event",
      },
      {
        label: "My Second Event",
        value: "My Second Event",
      },
      {
        label: "My Third Event",
        value: "My Third Event",
      },
      {
        label: "My Fourth Event",
        value: "My Fourth Event",
      },
    ];
  } else if (node.filterKind === FilterKind.UserAttribute) {
    return [
      {
        label: "First Name",
        value: "firstName",
      },
    ];
  }
  return [];
};
