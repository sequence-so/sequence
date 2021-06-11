import React, { useRef } from "react";
import { Position } from "react-flow-renderer";
import { NodeElementType } from "../CampaignEditorGrid";
import { CampaignNodeKind, EdgeKind } from "common/campaign";
import { useGridNode } from "hooks/useGridNode";
import { RenderCampaignNodeProps } from "./RenderCampaignNode";
import NodeOptions from "./NodeOptions";
import CustomHandle from "./CustomHandle";

const shouldRenderLeftHandle = (kind: NodeElementType["type"]) => {
  switch (kind) {
    case CampaignNodeKind.Email:
    case CampaignNodeKind.Wait:
    case CampaignNodeKind.Filter:
      return true;
    case CampaignNodeKind.Audience:
    case CampaignNodeKind.Trigger:
    default:
      return false;
  }
};

const shouldRenderTwoRightHandles = (kind: NodeElementType["type"]) => {
  switch (kind) {
    case CampaignNodeKind.Filter:
      return true;
    case CampaignNodeKind.Audience:
    case CampaignNodeKind.Trigger:
    case CampaignNodeKind.Email:
    case CampaignNodeKind.Wait:
    default:
      return false;
  }
};

interface GridNodeProps extends Omit<RenderCampaignNodeProps, "isGridNode"> {
  children: React.ReactElement;
}

const GridNode = (props: GridNodeProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const {
    onContainerMouseLeave,
    onContainerMouseOver,
    onDeleteCampaignNode,
    onOpenUserInspector,
    isValidConnection,
    onHandleMouseOut,
    connectionValid,
    isConnecting,
    onClickNode,
    hovering,
    name,
    debugNodeId,
  } = useGridNode({ id: props.id, containerRef });
  const renderLeftHandle = shouldRenderLeftHandle(props.type);
  const renderTwoRightHandles = shouldRenderTwoRightHandles(props.type);

  const RenderLeftHandles = renderLeftHandle && (
    <CustomHandle
      id={EdgeKind.Default}
      hovering={hovering}
      type="target"
      position={Position.Left}
      style={{ borderRadius: 0 }}
      isValidConnection={isValidConnection}
      onMouseOut={onHandleMouseOut}
      connecting={isConnecting}
      text={""}
    />
  );

  const RenderRightHandles = renderTwoRightHandles ? (
    <>
      <CustomHandle
        hovering={hovering}
        type="source"
        position={Position.Right}
        id={EdgeKind.Default}
        style={{ top: "20%", borderRadius: 0 }}
        isValidConnection={isValidConnection}
        onMouseOut={onHandleMouseOut}
        text={"ON MATCH"}
        connecting={isConnecting}
      />
      <CustomHandle
        hovering={hovering}
        type="source"
        position={Position.Right}
        id={EdgeKind.Timeout}
        isValidConnection={isValidConnection}
        onMouseOut={onHandleMouseOut}
        style={{ top: "80%", borderRadius: 0 }}
        text={"IF NOT MATCHED"}
        connecting={isConnecting}
      />
    </>
  ) : (
    <>
      <CustomHandle
        hovering={hovering}
        type="source"
        position={Position.Right}
        id={EdgeKind.Default}
        style={{ top: "50%", borderRadius: 0 }}
        isValidConnection={isValidConnection}
        onMouseOut={onHandleMouseOut}
        text={"WHEN FINISHED"}
        connecting={isConnecting}
      />
    </>
  );

  const children = hovering && (
    <NodeOptions
      onDeleteCampaignNode={onDeleteCampaignNode}
      onOpenUserInspector={onOpenUserInspector}
    />
  );

  return (
    <>
      <div
        className={"outer-container"}
        onMouseOver={onContainerMouseOver}
        onMouseLeave={onContainerMouseLeave}
        ref={containerRef}
      >
        {React.cloneElement(props.children, {
          name,
          onDragStart: props.onDragStart,
          onClick: onClickNode,
          title: props.title,
          subtitle: props.subtitle,
          renderLeftHandles: RenderLeftHandles,
          renderRightHandles: RenderRightHandles,
          connectionValid: connectionValid,
          children: children,
        })}
        <style jsx>{`
          .outer-container {
            display: flex;
            position: relative;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 300px;
            height: 130px;
          }
          .debug-node-id {
            position: absolute;
            bottom: 0px;
            text-wrap: nowrap;
            text-transform: uppercase;
          }
        `}</style>
      </div>
      {debugNodeId && <span className="debug-node-id">{props.id}</span>}
    </>
  );
};

export default GridNode;
