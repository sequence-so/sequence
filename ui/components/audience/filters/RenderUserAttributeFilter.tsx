import { useState } from "react";
import Select from "components/common/Select";
import { AttributeFilter } from "common/filters";
import OperatorsSelect from "../OperatorsSelect";
import { RenderNodeProps } from "../RenderNode";
import CreateInput from "components/common/CreateInput";

interface Props extends RenderNodeProps {
  node: AttributeFilter;
}

const RenderUserAttributeFilterInner = ({ node }: Props) => {
  const [currentValue, setCurrentValue] =
    useState<{ label: string; value: string } | null>(null);

  return (
    <>
      <Select
        value={currentValue}
        options={node.getFilterOptions()}
        onChange={(option) => {
          node.setAttribute(option.value);
          setCurrentValue(option);
        }}
      />
      <OperatorsSelect node={node} />
    </>
  );
};

export default RenderUserAttributeFilterInner;
