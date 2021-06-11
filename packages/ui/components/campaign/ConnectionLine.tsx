import {
  ArrowHeadType,
  ConnectionLineComponentProps,
  getBezierPath,
  getMarkerEnd,
} from "react-flow-renderer";

const ConnectionLine = ({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  connectionLineType,
  connectionLineStyle,
}: ConnectionLineComponentProps) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(ArrowHeadType.ArrowClosed);

  return (
    <g>
      <path
        style={{ color: "#7E7E7E", strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      ></path>
    </g>
  );
};

export default ConnectionLine;
