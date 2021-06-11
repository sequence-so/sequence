import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "react-flow-renderer";
import { Easing, Tween, autoPlay } from "es6-tween";
import EditorStateManager from "../editor/EditorStateManager";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import TriggerInspector from "./inspectors/TriggerInspector";
import { CampaignNodeKind } from "common/campaign";
import AudienceInspector from "./inspectors/AudienceInspector";
import EmailInspector from "./inspectors/EmailInspector";
import FilterInspector from "./inspectors/FilterInspector";
import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import TriggerCampaignNode from "common/campaign/nodes/triggerCampaignNode";
import AudienceCampaignNode from "common/campaign/nodes/audienceCampaignNode";
import WaitCampaignNode from "common/campaign/nodes/waitCampaignNode";
import FilterCampaignNode from "common/campaign/nodes/filterCampaignNode";
import WaitInspector from "./inspectors/WaitInspector";
import { InspectingNodeStateTab } from "../editor/InspectorNodeState";
import InspectorUsersTab from "./InspectorUsersTab";

interface Props {
  node: AbstractCampaignNode;
  reactFlowInstance: any;
  editor: EditorStateManager;
  tab: InspectingNodeStateTab;
}

autoPlay(true);

const TRANSITION_TIME = 300;
const EASING = Easing.Quadratic.Out;
const BORDER_LEFT = 50;
const CONTAINER_HEIGHT = 500;

const InspectorSidebar = (props: Props) => {
  const store = useStore();
  const editorRef = useRef(props.editor);
  const [isDraggingPane, setIsDraggingPane] = useState(false);
  const tweenRef = useRef<Tween>();
  const focusNode = (node: AbstractCampaignNode) => {
    const { nodes } = store.getState();
    if (nodes.length) {
      const foundNode = nodes[nodes.findIndex((n) => n.id === node.id)];
      const x = foundNode.__rf.position.x;
      const y = foundNode.__rf.position.y;
      handleTransform({ x, y });
    }
  };
  useEffect(() => {
    focusNode(props.node);
    const onDraggingPane = (value: boolean) => {
      setIsDraggingPane(value);
      if (value) {
        tweenRef.current.stop();
      }
    };
    editorRef.current.emitter.on("draggingPaneChanged", onDraggingPane);
    return () => {
      editorRef.current.emitter.removeListener(
        "draggingPaneChanged",
        onDraggingPane
      );
    };
  }, [props.node.id]);

  const handleTransform = useCallback(
    (transform) => {
      const {
        position: [x, y],
        zoom,
      } = props.reactFlowInstance.toObject();

      tweenRef.current = new Tween({ x: x, y: y, zoom })
        .to(
          {
            x: -1 * transform.x + BORDER_LEFT * (1 / zoom),
            y: -1 * transform.y + (CONTAINER_HEIGHT / 2) * (1 / zoom),
          },
          TRANSITION_TIME
        )
        .easing(EASING)
        .on("update", ({ x, y, zoom }) =>
          props.reactFlowInstance.setTransform({ x, y, zoom })
        )
        .start();
    },
    [props.reactFlowInstance]
  );

  switch (props.node.kind) {
    case CampaignNodeKind.Audience:
      return <AudienceInspector node={props.node as AudienceCampaignNode} />;
    case CampaignNodeKind.Trigger:
      return <TriggerInspector node={props.node as TriggerCampaignNode} />;
    case CampaignNodeKind.Email:
      return <EmailInspector node={props.node as EmailCampaignNode} />;
    case CampaignNodeKind.Wait:
      return <WaitInspector node={props.node as WaitCampaignNode} />;
    case CampaignNodeKind.Filter:
      return <FilterInspector node={props.node as FilterCampaignNode} />;
  }
};
export default InspectorSidebar;
