import { NodeKind, AbstractNode, NodeParseError } from "common/filters";
import RenderNodeByKind from "./RenderNodeByKind";
import { mapNodeKindToSelectOption, SELECT_OPTIONS } from "./AudienceConstants";
import CommonSelect from "../common/Select";
import { Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AudienceBuilderContext } from "components/AudienceBuilder";

export interface RenderNodeProps {
  node: AbstractNode;
  depth: number;
  remove: () => void;
  onChangeNodeKind: (nodeKind: NodeKind) => void;
  errors: NodeParseError[];
}

const RemoveNode = (props: RenderNodeProps) => (
  <Tooltip title={"Delete filter"} placement="bottom">
    <span
      style={{
        marginLeft: "auto",
      }}
      onClick={() => {
        props.remove();
      }}
    >
      <FontAwesomeIcon icon={faTimesCircle} color="#9FA1A4"></FontAwesomeIcon>
    </span>
  </Tooltip>
);

const RenderNode = (props: RenderNodeProps) => {
  const audienceBuilderContext = useContext(AudienceBuilderContext);
  const editable = audienceBuilderContext.editable;
  const onChangeNodeKind = ({ value }: { value: string }) => {
    props.onChangeNodeKind(value as any);
  };

  const error = props.errors.find((e) => e.id === props.node.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        {props.node.nodeKind === NodeKind.Filter && (
          <SelectNodeByKind
            {...props}
            node={props.node}
            editable={editable}
            onChange={onChangeNodeKind}
          />
        )}
        <RenderNodeByKind {...props} />
        {props.node.nodeKind === NodeKind.Filter && editable && (
          <RemoveNode {...props} />
        )}
      </div>
      {error && (
        <p style={{ color: "red", marginBlockStart: 0 }}>{error.error}</p>
      )}
    </div>
  );
};

const SelectNodeByKind = ({ node, onChange, editable }) => {
  return (
    <CommonSelect
      value={mapNodeKindToSelectOption(node)}
      options={SELECT_OPTIONS}
      onChange={onChange}
      isDisabled={!editable}
    />
  );
};

export default RenderNode;
