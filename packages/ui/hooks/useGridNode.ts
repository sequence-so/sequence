import { canConnect } from "common/campaign";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import { EditorContext } from "components/campaign/CampaignEditorGrid";
import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Connection, OnConnectStartParams } from "react-flow-renderer";
import useDebugNode from "./useDebugNode";
import useIsDragging from "./useIsDragging";

interface Props {
  id: string;
  containerRef: MutableRefObject<HTMLDivElement>;
}

export const useGridNode = (props: Props) => {
  const context = useContext(EditorContext);
  const { isDragging } = useIsDragging();
  const [connectionValid, setConnectionValid] = useState(null);
  const [toConnectionValid, setToConnectionValid] = useState<boolean>(null);
  const [name, setName] = useState<string>();
  const [hovering, setHovering] = useState(false);
  const [isConnecting, setConnecting] = useState(false);
  const { debug, forceHover } = useDebugNode();

  useEffect(() => {
    const onConnectStart = (params: OnConnectStartParams) => {
      if (params.nodeId === props.id) {
        setConnecting(true);
      }
    };

    const connectingCb = ({
      to,
      from,
      valid,
    }: {
      to: AbstractCampaignNode;
      from: AbstractCampaignNode;
      valid: boolean;
    }) => {
      // if (to.id === props.id) {
      //   setConnecting(true);
      // }
      if (to.id === props.id && !valid) {
        setConnectionValid(false);
      }
    };
    const node = context.graph.getNodeById(props.id);

    const connectingStopCb = (): void => {
      setConnectionValid(null);
      setConnecting(false);
    };

    const onNodeChange = (node: AbstractCampaignNode) => {
      if (name !== node.getName()) {
        setName(node.getName());
      }
    };

    setName(node.getName());
    context.emitter.on("onConnectStart", onConnectStart);
    context.emitter.on("connecting", connectingCb);
    context.emitter.on("connectingStop", connectingStopCb);
    context.emitter.on(`campaignNode:${node.id}`, onNodeChange);
    return () => {
      context.emitter.removeListener("connecting", connectingCb);
      context.emitter.removeListener("connectingStop", connectingStopCb);
      context.emitter.removeListener(`campaignNode:${node.id}`, onNodeChange);
      context.emitter.removeListener(`onConnectStart`, onConnectStart);
    };
  }, []);

  const onDeleteCampaignNode = (): void => {
    context.deleteCampaignNode(props.id);
  };

  const onClickNode = useCallback((): void => {
    if (!isDragging) {
      context.selectCampaignNode(props.id);
    }
  }, [isDragging]);

  /**
   * Handler used by all nodes to know if a connection is valid
   */
  const isValidConnection = useCallback((connection: Connection) => {
    const from = context.graph.getNodeById(connection.source);
    const to = context.graph.getNodeById(connection.target);
    if (from.id === to.id) {
      return false;
    }
    let valid = false;
    if (
      connection.sourceHandle === "Timeout" &&
      connection.targetHandle === "Timeout"
    ) {
      valid = false;
    } else {
      valid = canConnect(from, to);
      context.onConnectingNodes(from, to, valid);
    }
    setConnectionValid(valid);
    return valid;
  }, []);

  // const onValidConnectionChanged = useCallback((): void => {
  //   if (props.id)
  // }, [connectionValid, connecting]);
  const onHandleMouseOut = useCallback((): void => {
    // if (!toConnectionValid) {
    //   setToConnectionValid(null);
    // }
  }, []);

  const onContainerMouseOver = useCallback(() => {
    setHovering(true);
  }, []);

  const onContainerMouseLeave = useCallback(() => {
    setHovering(false);
  }, []);

  const onOpenUserInspector = useCallback(() => {}, []);

  useEffect(() => {
    if (!props.containerRef.current) {
      return;
    }
    if (debug) {
      props.containerRef.current.style.background = "#ff000081";
    } else {
      props.containerRef.current.style.background = "initial";
    }
  }, [props.containerRef, debug]);

  return {
    hovering: forceHover === true ? forceHover : hovering,
    debugNodeId: debug === true,
    onContainerMouseLeave,
    onContainerMouseOver,
    onDeleteCampaignNode,
    onOpenUserInspector,
    isValidConnection,
    onHandleMouseOut,
    connectionValid,
    isConnecting,
    onClickNode,
    debug,
    name,
  };
};
