import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  Edge as ReactFlowEdge,
  OnConnectStartParams,
} from "react-flow-renderer";
import styles from "./dnd.module.css";
import EditorStateManager, {
  EditorOperation,
} from "./editor/EditorStateManager";
import RenderAudienceNode from "./nodes/RenderAudienceNode";
import RenderEdge from "./nodes/RenderEdge";
import RenderEmailNode from "./nodes/RenderEmailNode";
import RenderFilterNode from "./nodes/RenderFilterNode";
import RenderTriggerNode from "./nodes/RenderTriggerNode";
import RenderWaitNode from "./nodes/RenderWaitNode";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import {
  CampaignGraph,
  CampaignNodeKind,
  canConnect,
  Edge,
  EdgeKind,
} from "common/campaign";
import AudienceCampaignNode from "common/campaign/nodes/audienceCampaignNode";
import TriggerCampaignNode from "common/campaign/nodes/triggerCampaignNode";
import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import WaitCampaignNode from "common/campaign/nodes/waitCampaignNode";
import FilterCampaignNode from "common/campaign/nodes/filterCampaignNode";
import EditorAlert from "./EditorAlert";
import { useMutation } from "@apollo/client";
import {
  CREATE_CAMPAIGN_NODE,
  CREATE_CAMPAIGN_NODE_EDGE,
  DELETE_CAMAPIGN_NODE,
  DELETE_CAMAPIGN_NODE_EDGE,
  UPDATE_CAMPAIGN_NODE,
} from "./CampaignQueries";
import {
  CreateCampaignNode,
  CreateCampaignNodeVariables,
} from "__generated__/CreateCampaignNode";
import {
  UpdateCampaignNode,
  UpdateCampaignNodeVariables,
} from "__generated__/UpdateCampaignNode";
import {
  createEdgeElementType,
  createNodeElementType,
} from "./createNodeElementType";
import {
  DeleteCampaignNode,
  DeleteCampaignNodeVariables,
} from "__generated__/DeleteCampaignNode";
import ConnectionLine from "./ConnectionLine";
import {
  ConnectCampaignNodes,
  ConnectCampaignNodesVariables,
} from "__generated__/ConnectCampaignNodes";
import CampaignNavbar from "./CampaignNavbar";
import { DashboardContext } from "layout/DashboardLayout";
import useTimeout from "@rooks/use-timeout";
import DebugNodeProvider from "./DebugNodeProvider";
import DebugNodeWindow from "./nodes/DebugNodeWindow";

const NODE_TYPES = {
  [CampaignNodeKind.Trigger]: RenderTriggerNode,
  [CampaignNodeKind.Audience]: RenderAudienceNode,
  [CampaignNodeKind.Filter]: RenderFilterNode,
  [CampaignNodeKind.Wait]: RenderWaitNode,
  [CampaignNodeKind.Email]: RenderEmailNode,
};

const EDGE_TYPES = {
  [EdgeKind.Default]: RenderEdge,
  [EdgeKind.Timeout]: RenderEdge,
};

export interface NodeElementType {
  id: string;
  type: CampaignNodeKind | EdgeKind;
  source?: string;
  target?: string;
  data: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
  arrowHeadType: string;
  selected?: boolean;
}

export interface EdgeElementType {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: EdgeKind;
}

export type ElementType = NodeElementType | EdgeElementType;

export const EditorContext = React.createContext<EditorStateManager>(null);
interface Props {
  editorState: EditorStateManager;
}

const connectionLineStyle = { color: "#7E7E7E", stroke: "#7E7E7E" };

const generateNodeFunction = (kind: CampaignNodeKind): AbstractCampaignNode => {
  switch (kind) {
    case CampaignNodeKind.Audience:
      return AudienceCampaignNode.new();
    case CampaignNodeKind.Email:
      return EmailCampaignNode.new();
    case CampaignNodeKind.Filter:
      return FilterCampaignNode.new();
    case CampaignNodeKind.Trigger:
      return TriggerCampaignNode.new();
    case CampaignNodeKind.Wait:
      return WaitCampaignNode.new();
  }
};

const validateConnection = (
  editor: EditorStateManager,
  node: ReactFlowEdge
) => {
  const from = node.source;
  const to = node.target;
  const fromNode = editor.graph.getNodeById(from);
  const toNode = editor.graph.getNodeById(to);
  const existingEdge = editor.graph.getEdge(fromNode, toNode);
  if (existingEdge) {
    return false;
  }
  return canConnect(fromNode, toNode);
};

const createElements = (graph: CampaignGraph) => {
  const nodes = graph.getNodes().map(createNodeElementType);
  const edges = graph.getEdges().map(createEdgeElementType);
  return [...nodes, ...edges];
};

const CampaignEditorGrid = (props: Props) => {
  const editorStateRef = props.editorState;
  const elementsRef = useRef<ElementType[]>();
  const [createCampaignNode] = useMutation<
    CreateCampaignNode,
    CreateCampaignNodeVariables
  >(CREATE_CAMPAIGN_NODE);
  const [updateCampaignNode] = useMutation<
    UpdateCampaignNode,
    UpdateCampaignNodeVariables
  >(UPDATE_CAMPAIGN_NODE);
  const [deleteCampaignNode] = useMutation<
    DeleteCampaignNode,
    DeleteCampaignNodeVariables
  >(DELETE_CAMAPIGN_NODE);
  const [connectCampaignNodes] = useMutation<
    ConnectCampaignNodes,
    ConnectCampaignNodesVariables
  >(CREATE_CAMPAIGN_NODE_EDGE);
  const [disconnectNodes] = useMutation<
    DeleteCampaignNode,
    DeleteCampaignNodeVariables
  >(DELETE_CAMAPIGN_NODE_EDGE);
  const [_, setOperationId] = useState(editorStateRef.operationId);

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState<ElementType[]>(
    createElements(editorStateRef.graph)
  );
  const [error, setError] = useState("");
  const dashboardContext = useContext(DashboardContext);
  elementsRef.current = elements;

  const clearError = useTimeout(() => {
    setError("");
  }, 5000);

  useEffect(() => {
    if (error) {
      clearError.clear();
    }
  }, [error]);

  /**
   * Connection between two nodes.
   *
   * @param params ReactFlowEdge
   */
  const onConnect = (params: ReactFlowEdge) => {
    if (!validateConnection(editorStateRef, params)) {
      setError("These two nodes can't be connected in this way");
      clearError.start();
      return;
    }
    const sourceId = params.source;
    const targetId = params.target;
    const edgeKind = (
      params.sourceHandle ? params.sourceHandle : EdgeKind.Default
    ) as EdgeKind;
    const newEdge = Edge.new(sourceId, targetId, edgeKind);
    const newEdgeElement: EdgeElementType = {
      id: newEdge.getId(),
      source: sourceId,
      target: targetId,
      type: edgeKind,
    };
    if (params.sourceHandle) {
      newEdgeElement.sourceHandle = params.sourceHandle;
    }

    const nextElements = addEdge(
      newEdgeElement,
      elementsRef.current
    ) as NodeElementType[];
    const graph = editorStateRef.graph;
    graph.addEdge(sourceId, targetId, edgeKind, newEdge.getId());
    connectCampaignNodes({
      variables: {
        id: newEdge.getId(),
        fromId: sourceId,
        toId: targetId,
        edgeKind: edgeKind,
      },
    });
    setElements(nextElements);
  };
  const onElementsRemove = (elementsToRemove: NodeElementType[]) => {
    const nextElements = removeElements(
      elementsToRemove,
      elements
    ) as NodeElementType[];
    setElements(nextElements);
  };

  const onStateChange = (editor: EditorStateManager) => {
    setOperationId(editor.operationId);
  };

  const onDeleteCampaignNode = (obj: EditorOperation) => {
    const elementsToRemove = [elementsRef.current.find((e) => e.id === obj.id)];
    const nextElements = removeElements(
      elementsToRemove,
      elementsRef.current
    ) as NodeElementType[];
    console.log(nextElements);
    setElements(nextElements);
    deleteCampaignNode({
      variables: {
        id: obj.id,
      },
    });
  };

  const onDeleteCampaignNodeEdge = (obj: EditorOperation) => {
    const elementsToRemove = [elementsRef.current.find((e) => e.id === obj.id)];
    const nextElements = removeElements(
      elementsToRemove,
      elementsRef.current
    ) as NodeElementType[];
    setElements(nextElements);
    disconnectNodes({
      variables: {
        id: obj.id,
      },
    });
  };

  /**
   * Clicking an element should select it and open the inspector
   * @param event Event
   * @param element Node
   */
  const onSelectCampaignNode = (element: NodeElementType) => {
    let copy = [...elementsRef.current].map((curr) => {
      if (curr.id == element.id) {
        return {
          ...curr,
          selected: true,
        };
      }
      return {
        ...curr,
        selected: false,
      };
    });
    setElements(copy);
  };

  const onDeselectCampaignNode = () => {
    let copy = [...elementsRef.current].map((curr) => ({
      ...curr,
      selected: false,
    }));
    setElements(copy);
  };

  useEffect((): any => {
    editorStateRef.emitter.on("stateChange", onStateChange);
    editorStateRef.emitter.on("campaignNodeDelete", onDeleteCampaignNode);
    editorStateRef.emitter.on("campaignNodeSelected", onSelectCampaignNode);
    editorStateRef.emitter.on(
      "campaignNodeEdgeDelete",
      onDeleteCampaignNodeEdge
    );
    editorStateRef.emitter.on("campaignNodeDeselected", onDeselectCampaignNode);
    return () => {
      editorStateRef.emitter.removeListener("stateChange", onStateChange);
      editorStateRef.emitter.removeListener(
        "stateChange",
        onDeleteCampaignNode
      );
      editorStateRef.emitter.removeListener(
        "campaignNodeEdgeDelete",
        onDeleteCampaignNodeEdge
      );
      editorStateRef.emitter.removeListener(
        "campaignNodeDeselected",
        onDeselectCampaignNode
      );
    };
  }, []);

  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance);
    editorStateRef.reactFlowInstance = _reactFlowInstance;
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const kind = event.dataTransfer.getData(
      "application/reactflow"
    ) as CampaignNodeKind;
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left - 140,
      y: event.clientY - reactFlowBounds.top - 50,
    });

    let newElement = generateNodeFunction(kind);
    // network request here
    const newNode = {
      id: newElement.id,
      type: kind,
      position,
      data: {},
      arrowHeadType: "arrowclosed",
    };
    editorStateRef.graph.addNode(newElement);
    createCampaignNode({
      variables: {
        id: newElement.id,
        kind: kind,
        campaignId: editorStateRef.campaignId,
        name: kind,
        positionX: position.x,
        positionY: position.y,
      },
    });
    setElements((es) => es.concat(newNode));
  };

  /**
   * Moving nodes around, event when you drop it.
   */
  const onDragNodeStop = useCallback((event: any, node: NodeElementType) => {
    const internalNode = props.editorState.graph.getNodeById(node.id);
    internalNode.setPositionX(node.position.x);
    internalNode.setPositionY(node.position.y);
    updateCampaignNode({
      variables: {
        id: node.id,
        positionX: node.position.x,
        positionY: node.position.y,
      },
    });
  }, []);

  const onPaneClick = useCallback((): void => {
    props.editorState.deselectNode();
  }, []);

  const onMoveEnd = useCallback(() => {
    editorStateRef.setDraggingPane(false);
  }, [editorStateRef]);

  const onMoveStart = useCallback((): void => {
    editorStateRef.setDraggingPane(true);
  }, [editorStateRef]);

  const onConnectStart = useCallback(
    (_: any, params: OnConnectStartParams): void => {
      editorStateRef.onConnectStart(params);
    },
    [editorStateRef]
  );

  const onConnectStop = useCallback((): void => {
    editorStateRef.onConnectStop();
  }, [editorStateRef]);

  return (
    <EditorContext.Provider value={editorStateRef}>
      <DebugNodeProvider elements={elements}>
        <div className={styles.editor_container}>
          <CampaignNavbar />
          <div className={styles.dndflow}>
            <ReactFlowProvider>
              <div
                className="reactflow-wrapper"
                ref={reactFlowWrapper}
                style={{
                  width: "100%",
                  height: dashboardContext.contentPaneHeight,
                  minHeight: "500px",
                  position: "relative",
                }}
              >
                <ReactFlow
                  elements={elements}
                  onConnect={onConnect}
                  onElementsRemove={onElementsRemove}
                  onLoad={onLoad}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  snapToGrid={true}
                  nodeTypes={NODE_TYPES}
                  connectionLineComponent={ConnectionLine}
                  onNodeDragStop={onDragNodeStop}
                  edgeTypes={EDGE_TYPES}
                  connectionMode={ConnectionMode.Loose}
                  selectNodesOnDrag={false}
                  connectionLineType={ConnectionLineType.SmoothStep}
                  arrowHeadColor={"#7E7E7E"}
                  connectionLineStyle={connectionLineStyle}
                  onPaneClick={onPaneClick}
                  onMoveStart={onMoveStart}
                  onMoveEnd={onMoveEnd}
                  zoomOnDoubleClick={false}
                  onConnectStart={onConnectStart}
                  onConnectStop={onConnectStop}
                >
                  <Background
                    variant={BackgroundVariant.Dots}
                    color="#949494"
                    style={{ backgroundColor: "#d8d8d8" }}
                  />
                  <Controls />
                </ReactFlow>
              </div>
              {editorStateRef.renderSidebar()}
            </ReactFlowProvider>
            <EditorAlert text={error} />
          </div>
        </div>
        <DebugNodeWindow />
      </DebugNodeProvider>
    </EditorContext.Provider>
  );
};

export default CampaignEditorGrid;
