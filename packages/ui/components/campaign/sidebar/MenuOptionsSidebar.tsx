import classNames from "classnames";
import React, { useContext, useState } from "react";
import styles from "./sidebar.module.css";
import RenderAudienceNode from "../nodes/RenderAudienceNode";
import RenderTriggerNode from "../nodes/RenderTriggerNode";
import RenderWaitNodeNode from "../nodes/RenderWaitNode";
import RenderFilterNode from "../nodes/RenderFilterNode";
import RenderEmailNode from "../nodes/RenderEmailNode";
import Collapse from "components/Collapse";
import useTimeout from "@rooks/use-timeout";
import { CampaignNodeKind } from "common/campaign";
import { DashboardContext } from "layout/DashboardLayout";

const HIDE_TIMEOUT = 2000;

const MenuOptionsSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const context = useContext(DashboardContext);
  const handler = useTimeout(() => {
    // setShowSidebar(false);
  }, HIDE_TIMEOUT);

  return (
    <div
      className={styles.sidebar_area}
      draggable={false}
      onMouseOver={(e) => {
        e.stopPropagation();
        handler.clear();
        setShowSidebar(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        handler.start();
      }}
      style={{
        height: context.contentPaneHeight - 1,
      }}
    >
      <aside
        className={classNames(
          styles.sidebar,
          styles.sidebar_transition,
          !showSidebar ? styles.hidden_sidebar : ""
        )}
        style={{
          height: context.contentPaneHeight - 1,
        }}
      >
        <div className={styles.section}>
          <div className={styles.section_title}>CAMPAIGN START</div>
          <RenderTriggerNode
            isGridNode={false}
            onDragStart={(event) => {
              event.stopPropagation();
              onDragStart(event, CampaignNodeKind.Trigger);
            }}
            draggable
          />
          <RenderAudienceNode
            isGridNode={false}
            onDragStart={(event) => {
              event.stopPropagation();
              onDragStart(event, CampaignNodeKind.Audience);
            }}
            draggable
          />
        </div>
        <div className={styles.section}>
          <div className={styles.section_title}>AUDIENCE FILTERING</div>
          <RenderFilterNode
            isGridNode={false}
            onDragStart={(event) => {
              event.stopPropagation();
              onDragStart(event, CampaignNodeKind.Filter);
            }}
            draggable
          />
        </div>
        <div className={styles.section}>
          <div className={styles.section_title}>ACTIONS</div>
          <RenderWaitNodeNode
            isGridNode={false}
            onDragStart={(event) => {
              event.stopPropagation();
              onDragStart(event, CampaignNodeKind.Wait);
            }}
            draggable
          />
          <RenderEmailNode
            isGridNode={false}
            onDragStart={(event) => {
              event.stopPropagation();
              onDragStart(event, CampaignNodeKind.Email);
            }}
            draggable
          />
        </div>
      </aside>
    </div>
  );
};
export default MenuOptionsSidebar;
