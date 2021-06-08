import { useEffect, useState } from "react";
import Select from "components/common/Select";
import { AbstractFilterNode } from "common/filters/nodes";
import { DEFAULT_OPERATOR_VALUE } from "./AudienceConstants";
import CreateInput from "components/common/CreateInput";

interface Props {
  node: AbstractFilterNode;
}

const OperatorsSelect = ({ node }: Props) => {
  const [operator, setOperator] = useState<{
    label: string;
    value: string;
    args: number;
  }>(DEFAULT_OPERATOR_VALUE);

  useEffect(() => {
    node[node.getOperators().find((e) => e.value === "equals").value as any]();
  }, []);
  const onChange = (event) => {
    const op = node.getOperators().find((e) => e.value === event.value);
    if (!op) {
      return;
    }
    setOperator(op);
    if (typeof node.expected !== "undefined") {
      node[op.value](node.expected);
    } else {
      node[op.value]();
    }
  };

  return (
    <>
      <Select
        value={operator}
        options={node.getOperators()}
        onChange={onChange}
      />
      {operator &&
        !!operator.args &&
        new Array(operator.args).fill(null).map((_) => (
          <CreateInput
            defaultValue={node.expected}
            onChangeText={(value) => {
              node.expected = value;
            }}
          />
        ))}
    </>
  );
};

export default OperatorsSelect;
