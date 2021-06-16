import React, { useContext } from "react";
import {
  ArrowHeadType,
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
} from "react-flow-renderer";
import { EditorContext } from "../CampaignEditorGrid";
import SmallX from "public/small_x.svg";

const foreignObjectSize = 40;

const RenderEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) => {
  const context = useContext(EditorContext);
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(ArrowHeadType.ArrowClosed, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const onEdgeClick = (evt) => {
    evt.stopPropagation();
    context.deleteEdge(id);
  };

  return (
    <>
      <path
        id={id}
        style={{ ...style, color: "#7E7E7E", strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      ></path>
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <body>
          <div className="edgebutton" onClick={(event) => onEdgeClick(event)}>
            <img src={SmallX} style={{ width: 12, height: 12 }} />
          </div>
        </body>
      </foreignObject>
    </>
  );
};
export default RenderEdge;
