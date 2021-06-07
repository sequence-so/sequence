import { useRef, useState } from "react";
import {
  ConditionNodeKind,
  NodeParseError,
  Condition,
  AbstractNode,
} from "common/filters";
import {
  mapCreateFilterToNode,
  ROOT_SELECT_OPTIONS,
} from "./AudienceConstants";
import { CreateFilter } from "./CreateFilter";
import RenderNode from "./RenderNode";
import RenderConditionKind from "./RenderConditionKind";
import CommonSelect from "../common/Select";
import filterStyles from "styles/filter.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@material-ui/core";

interface RenderConditionProps {
  node: Condition;
  depth: number;
  remove: () => void;
  errors: NodeParseError[];
}

interface FilterState {
  id: string;
  node: AbstractNode;
}

const createFilterState = (nodes: AbstractNode[]) => {
  return nodes.map((n) => ({ id: n.id, node: n }));
};

const RenderCondition = ({
  node,
  depth,
  remove: removeSelf,
  errors,
}: RenderConditionProps) => {
  const conditionNode = node;
  const [conditionKind, setConditionKind] = useState(node.conditionKind);
  const [filters, setFilters] = useState<FilterState[]>(
    createFilterState(node.children)
  );

  const addChild = (value: string) => {
    const insertion = mapCreateFilterToNode(value);
    const nextFilters = [...filters];
    nextFilters.push({
      id: insertion.id,
      node: insertion,
    });
    setFilters(nextFilters);
    conditionNode.children.push(insertion);
  };

  const remove = (id: string) => () => {
    const copy = [...filters];
    const idx = copy.findIndex((c) => c.id === id);
    if (idx !== -1) {
      copy.splice(idx, 1);
      setFilters(copy);
      conditionNode.children.splice(idx, 1);
    }
  };

  const setCondition = ({ value }) => {
    if (value === ConditionNodeKind.AND) {
      node.conditionKind = ConditionNodeKind.AND;
      setConditionKind(ConditionNodeKind.AND);
    } else {
      node.conditionKind = ConditionNodeKind.OR;
      setConditionKind(ConditionNodeKind.OR);
    }
  };

  const onChangeChildNodeKind = (id: string) => (nodeKind: any) => {
    const insertion = mapCreateFilterToNode(nodeKind);
    const nextFilters = [...filters];
    const idx = nextFilters.findIndex((filter) => filter.id === id);
    if (idx !== -1) {
      nextFilters.splice(idx, 1, {
        id: insertion.id,
        node: insertion,
      });
      setFilters(nextFilters);
      conditionNode.children.splice(idx, 1, insertion);
    }
  };

  const RenderFilters = filters.map(({ id, node }, index) => {
    return (
      <div key={id} className={filterStyles.filter_wrapper}>
        <RenderConditionKind idx={index} node={conditionNode} />
        <div
          style={{
            marginLeft: "10px",
            width: "100%",
          }}
        >
          <RenderNode
            node={node}
            depth={depth + 1}
            remove={remove(id)}
            onChangeNodeKind={onChangeChildNodeKind(id)}
            errors={errors}
          />
        </div>
      </div>
    );
  });

  return (
    <>
      <div className={depth > 0 ? "wrapper border" : "wrapper "}>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
              width: "100%",
            }}
          >
            <CommonSelect
              options={ROOT_SELECT_OPTIONS}
              value={{
                value: conditionKind === ConditionNodeKind.AND ? "and" : "or",
                label:
                  conditionKind === ConditionNodeKind.AND ? "All" : "One of",
              }}
              onChange={setCondition}
            />
            <span>of the following conditions match</span>
            {depth > 0 && (
              <Tooltip title={"Delete filter"} placement="bottom">
                <span
                  style={{ marginLeft: "auto" }}
                  onClick={() => {
                    removeSelf();
                  }}
                >
                  <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
                </span>
              </Tooltip>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {RenderFilters}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <RenderConditionKind
              idx={0}
              node={conditionNode}
              style={{ marginRight: 10 }}
            />
            <CreateFilter parent={conditionNode} addChild={addChild} />
          </div>
        </div>
      </div>
      <style jsx>{`
        .flex-two-col {
          display: flex;
          flex-direction: row;
        }
        .wrapper {
          position: relative;
          margin-bottom: 1em;
        }
        .border {
          border: 1px solid #e9e9e9;
          padding: 21px 17px;
          border-radius: 4px;
          flex-grow: 1;
        }
        .border:before {
          position: absolute;
          content: " ";
          width: 1px;
          left: -36px;
          height: calc(100% + 25px);
          top: 0px;
          border-left: 1px dashed #c2c2c2;
          z-index: -1;
        }
      `}</style>
    </>
  );
};

export default RenderCondition;
