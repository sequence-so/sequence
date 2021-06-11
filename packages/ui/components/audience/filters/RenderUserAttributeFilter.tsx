import { useContext, useEffect, useState } from "react";
import { Createable } from "components/common/Select";
import { AttributeFilter } from "common/filters";
import OperatorsSelect from "../OperatorsSelect";
import { RenderNodeProps } from "../RenderNode";
import { AudienceBuilderContext } from "components/AudienceBuilder";

interface Props extends RenderNodeProps {
  node: AttributeFilter;
}

const RenderUserAttributeFilterInner = ({ node }: Props) => {
  const audienceBuilderContext = useContext(AudienceBuilderContext);
  const editable = audienceBuilderContext.editable;
  const [currentValue, setCurrentValue] = useState<{
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    if (typeof node.attribute !== "undefined") {
      const filterOptions = node.getFilterOptions();
      const foundOption = filterOptions.find((f) => f.value === node.attribute);
      if (foundOption) {
        setCurrentValue(foundOption);
      }
    }
  }, []);

  return (
    <>
      <Createable
        value={currentValue}
        options={node.getFilterOptions()}
        onChange={(option) => {
          node.setAttribute(option.value);
          setCurrentValue(option);
          audienceBuilderContext.onChange();
        }}
        isDisabled={!editable}
      />
      <OperatorsSelect editable={editable} node={node} />
    </>
  );
};

export default RenderUserAttributeFilterInner;
