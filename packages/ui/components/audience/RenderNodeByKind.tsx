import {
  AttributeFilter,
  EventFilter,
  FilterKind,
  NodeKind,
} from "common/filters";
import { AbstractFilterNode, ConditionNode } from "common/filters/nodes";
import RenderUserAttributeFilter from "./filters/RenderUserAttributeFilter";
import RenderEventFilter from "./filters/RenderEventFilter";
import { RenderNodeProps } from "./RenderNode";
import RenderCondition from "./RenderCondition";

const RenderNodeByKind = (props: RenderNodeProps) => {
  const node = props.node;

  if (node.nodeKind === NodeKind.Condition) {
    return <RenderCondition {...props} node={props.node as ConditionNode} />;
  }
  let filterNode = node as AbstractFilterNode;
  if (filterNode.filterKind === FilterKind.Event) {
    return <RenderEventFilter {...props} node={node as EventFilter} />;
  } else if (filterNode.filterKind === FilterKind.UserAttribute) {
    return (
      <RenderUserAttributeFilter {...props} node={node as AttributeFilter} />
    );
  }
  return <p>Error: Could not identify node type.</p>;
};

export default RenderNodeByKind;
