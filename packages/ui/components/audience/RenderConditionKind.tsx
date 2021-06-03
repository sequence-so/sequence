import { Condition, ConditionNodeKind } from "common/filters";
import { CSSProperties } from "react";
import filterStyles from "styles/filter.module.css";

interface Props {
  node: Condition;
  idx: number;
  style?: CSSProperties;
}

const RenderConditionKind = ({ node, idx, style }: Props) => (
  <span className={filterStyles.condition_box} style={style}>
    {node.conditionKind === ConditionNodeKind.AND ? "And" : "or"}
  </span>
);

export default RenderConditionKind;
