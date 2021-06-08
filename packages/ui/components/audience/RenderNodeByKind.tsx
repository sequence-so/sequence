import {
  AttributeFilter,
  EventAttribute,
  EventFilter,
  FilterKind,
  NodeKind,
} from "common/filters";
import { AbstractFilterNode, ConditionNode } from "common/filters/nodes";
import RenderUserAttributeFilter from "./filters/RenderUserAttributeFilter";
import RenderEventFilter from "./filters/RenderEventFilter";
import { RenderNodeProps } from "./RenderNode";
import RenderCondition from "./RenderCondition";
import RenderEventAttributeFilter from "./filters/RenderEventAttributeFilter";

const RenderNodeByKind = (props: RenderNodeProps) => {
  const node = props.node;

  if (node.nodeKind === NodeKind.Condition) {
    return <RenderCondition {...props} node={props.node as ConditionNode} />;
  }
  let filterNode = node as AbstractFilterNode;
  if (filterNode.filterKind === FilterKind.Event) {
    return <RenderEventFilter {...props} node={node as EventFilter} />;
  } else if (filterNode.filterKind === FilterKind.EventAttribute) {
    return (
      <RenderEventAttributeFilter {...props} node={node as EventAttribute} />
    );
  } else if (filterNode.filterKind === FilterKind.UserAttribute) {
    return (
      <RenderUserAttributeFilter {...props} node={node as AttributeFilter} />
    );
  }
  return <p>Error: Could not identify node type.</p>;
};

export default RenderNodeByKind;
