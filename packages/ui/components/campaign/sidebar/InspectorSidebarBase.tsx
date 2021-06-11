import classNames from "classnames";
import TitleInput from "components/input/TitleInput";
import React, { useContext } from "react";
import styles from "./sidebar.module.css";
import { defaultProp } from "services/defaultProp";
import { DashboardContext } from "layout/DashboardLayout";

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  fillColor?: string;
  placeholderTitle?: string;
  children?: React.ReactNode;
  renderCollapse?: boolean;
  onCollapseSidebar?: () => void;
  onChangeTitleText?: (value: string) => void;
  horizontalScroll?: boolean;
  regularSize?: boolean;
}

const InspectorSidebarBase = (props: Props) => {
  const onChangeTitleText = defaultProp(props.onChangeTitleText, () => {});
  const horizontalScroll = defaultProp(props.horizontalScroll, false);
  const regularSize = defaultProp(props.regularSize, false);
  const context = useContext(DashboardContext);

  return (
    <aside
      className={classNames(
        styles.sidebar,
        !regularSize ? styles.max_sidebar : ""
      )}
      style={{ top: -71, height: context.contentPaneHeight + 71 }}
    >
      <div className={"title-section"}>
        <div className="title-input">
          <div className="icon_fill">
            <img src={props.icon} />
          </div>
          <TitleInput
            value={props.title}
            onChangeText={onChangeTitleText}
            placeholder={props.placeholderTitle}
            style={{ marginBlockStart: 0, marginBlockEnd: 0, marginLeft: 8 }}
          />
        </div>
        <p className="subtitle">{props.subtitle}</p>
      </div>
      <div className={"title_bar_line"}></div>
      <div
        style={{
          overflowY: "scroll",
          overflowX: horizontalScroll ? "scroll" : "initial",
          height: "100%",
          paddingLeft: 1,
        }}
      >
        {props.children}
      </div>
      <style jsx>{`
        .title-section {
          display: flex;
          flex-direction: column;
        }
        .title-input {
          display: flex;
          flex-direction: row;
          align-items: baseline;
        }
        .icon_fill {
          display: flex;
          width: 26.46px;
          height: 33.08px;
          background-color: ${props.fillColor || "#b536e1"};
          border-radius: 3px;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          align-self: flex-end;
        }
        .icon_fill > img {
          width: 12px;
        }
        .subtitle {
          font-size: 1rem;
          line-height: 29px;
          color: #4e4f55;
          margin-block-start: 0.5em;
          margin-block-end: 0.5em;
        }
        .title_bar_line {
          width: 100%;
          height: 1px;
          content: " ";
          border-bottom: 1px solid #d0d0d0;
          margin-bottom: 1em;
        }
      `}</style>
    </aside>
  );
};

export default InspectorSidebarBase;
