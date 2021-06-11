import { useContext } from "react";
import { DraggingContext } from "./DragProvider";

const useIsDragging = () => {
  const context = useContext(DraggingContext);
  return { isDragging: context.isDragging };
};

export default useIsDragging;
