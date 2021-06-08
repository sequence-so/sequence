import { Operators } from "../operators";
import {
  ComparatorKind,
  ConditionNodeKind,
  FilterKind,
  NodeKind,
} from "../syntaxKind";

export * from "./serialize";
export * from "./deserialize";

export interface SerializedAbstractNode {
  id: string;
  nodeKind: NodeKind.Comparator | NodeKind.Condition | NodeKind.Filter;
}

export type SerializedValueNode =
  | SerializedAttributeFilter
  | SerializedEventAttributeNode
  | SerializedEventFilter
  | SerializedEmailNode
  | SerializedPageNode;

export interface SerializedConditionNode extends SerializedAbstractNode {
  nodeKind: NodeKind.Condition;
  conditionKind: ConditionNodeKind;
  operator: Operators;
  children: SerializedAbstractNode[];
}

export interface SerializedComparatorNode extends SerializedAbstractNode {
  nodeKind: NodeKind.Comparator;
  comparatorKind: ComparatorKind;
  operator: Operators;
}

export interface SerializedFilterNode extends SerializedAbstractNode {
  nodeKind: NodeKind.Comparator | NodeKind.Condition | NodeKind.Filter;
  filterKind: FilterKind;
  attribute: string | null;
  comparator: SerializedComparatorNode;
  expected: any;
}

export interface SerializedAttributeFilter extends SerializedFilterNode {
  nodeKind: NodeKind.Filter;
  filterKind: FilterKind.UserAttribute;
  comparator: SerializedComparatorNode;
  expected: string | number | undefined;
}

export interface SerializedEventFilter extends SerializedFilterNode {
  nodeKind: NodeKind.Filter;
  filterKind: FilterKind.Event;
  performed: boolean | undefined;
}

export interface SerializedEventAttributeNode extends SerializedFilterNode {
  nodeKind: NodeKind.Filter;
  filterKind: FilterKind.EventAttribute;
  eventName: string | undefined;
  expected: any;
}

export interface SerializedEmailNode extends SerializedFilterNode {
  nodeKind: NodeKind.Filter;
  filterKind: FilterKind.Email;
  eventName: string | undefined;
  expected: any;
  performed: boolean | undefined;
}

export interface SerializedPageNode extends SerializedFilterNode {
  nodeKind: NodeKind.Filter;
  filterKind: FilterKind.Page;
  eventName: string | undefined;
  expected: any;
  performed: boolean | undefined;
}
