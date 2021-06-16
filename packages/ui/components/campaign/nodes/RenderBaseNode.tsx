import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { NodeElementType } from "../CampaignEditorGrid";
import GrabberIcon from "public/grabber.svg";
import GrabberHoverIcon from "public/grabber_hover.svg";
import MouseOverIcon from "components/MouseOverIcon";
import BlockButton from "components/BlockButton";
export interface RenderBaseNodeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    Partial<Omit<NodeElementType, "id">> {
  id?: string;
  isGridNode: boolean;
  title: string;
  subtitle: string;
  icon: string;
  fillColor: string;
  name?: string;
  selected?: boolean;
  renderLeftHandles?: JSX.Element;
  renderRightHandles?: JSX.Element;
  children?: React.ReactNode;
  connectionValid?: boolean;
  toConnectionValid?: boolean;
}

const RenderBaseNode = (props: RenderBaseNodeProps) => {
  let {
    id,
    title,
    icon,
    subtitle,
    fillColor,
    isGridNode,
    renderLeftHandles,
    renderRightHandles,
    selected,
    connectionValid,
    ...otherProps
  } = props;

  return (
    <div
      className={
        props.className +
        " " +
        classNames(
          "container",
          {
            selected: props.selected,
          },
          props.connectionValid === false ? "invalid-to-connection" : ""
        )
      }
      {...otherProps}
    >
      {props.renderLeftHandles}
      <div className="icon_fill">
        <img src={icon} />
      </div>
      <div className="right">
        <span className="node_type">{title}</span>
        <span className="node_description">{props.name || subtitle}</span>
      </div>
      <BlockButton
        style={{
          alignSelf: "center",
          pointerEvents: "none",
        }}
      >
        <img src={GrabberIcon} />
      </BlockButton>
      {props.renderRightHandles}
      {props.children ? props.children : null}
      <style jsx>{`
        .container {
          position: relative;
          background: #ffffff;
          border: 1px solid #c5c5c5;
          box-sizing: border-box;
          display: flex;
          flex-align: row;
          border-radius: 4px;
          width: 245px;
          padding: 10px 0px;
          padding-left: 8px;
          cursor: grab;
          box-shadow: 0px 0px 4px rgba(15, 15, 15, 0.06),
            0px 2px 6px rgba(15, 15, 15, 0.06);
          transition: box-shadow 0.3s ease-in-out;
        }
        .container:hover {
          background-color: #fcfcfc;
          box-shadow: 0px 0px 5px rgba(15, 15, 15, 0.08),
            0px 3px 6px 2px rgba(15, 15, 15, 0.1),
            0px 6px 16px 4px rgba(15, 15, 15, 0.06);
        }
        .selected {
          background-color: #ffffeb;
          border: 1px solid var(--primary-blue);
          box-shadow: inset 0px 0px 0px 2px var(--primary-blue),
            var(--big-box-shadow);
        }
        .invalid-to-connection {
          background-color: #e98c8c;
        }
        .icon_fill {
          display: flex;
          width: 40px;
          height: 52px;
          background-color: ${fillColor};
          border-radius: 3px;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .icon_fill > img {
          width: 23px;
        }
        .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
        }
        .node_type {
          font-weight: 600;
          font-size: 14px;
          line-height: 21px;
          letter-spacing: 0.02em;
          margin-top: 4px;
          color: var(--body-text);
          pointer-events: none;
        }
        .node_description {
          margin-block-end: 0px;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 21px;
          color: var(--body-text);
          margin-top: 2px;
          text-overflow: ellipsis;
          width: 170px;
          overflow: auto;
          white-space: nowrap;
        }
        .grabber {
          margin-left: auto;
          align-self: center;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default RenderBaseNode;
