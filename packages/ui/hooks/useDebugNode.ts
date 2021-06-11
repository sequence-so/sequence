import { useContext } from "react";
import { DebugNodeContext } from "components/campaign/DebugNodeProvider";

const useDebugNode = () => {
  const context = useContext(DebugNodeContext);
  return context;
};

export default useDebugNode;
