import classNames from "classnames";
import { EdgeKind } from "campaign";
import React from "react";
import { Connection, Handle, Position } from "react-flow-renderer";
import { defaultProp } from "services/defaultProp";

interface Props {
  hovering: boolean;
  id: EdgeKind;
  type: "target" | "source";
  isValidConnection: (connection: Connection) => boolean;
  position: Position;
  onMouseOut: () => void;
  style?: React.CSSProperties;
  text?: string;
  connecting: boolean;
}

const CustomHandle = (props: Props) => {
  const text = defaultProp(props.text, "WHEN MATCHED");

  return (
    <>
      <Handle
        className={classNames(
          !props.hovering && !props.connecting ? "hide_handle" : ""
        )}
        type={props.type}
        position={props.position}
        id={props.id}
        style={{
          ...props.style,
        }}
        isValidConnection={props.isValidConnection}
        onMouseOut={props.onMouseOut}
        children={
          text && (
            <span
              className={classNames(
                "text",
                props.connecting ? "connecting" : ""
              )}
              style={{
                ...props.style,
              }}
            >
              {text}
            </span>
          )
        }
      />

      <style jsx>{`
        .container {
          position: relative;
        }
        .text {
          position: relative;
          font-weight: 600;
          font-size: 16px;
          line-height: 21px;
          color: #4b4b4b;
          position: absolute;
          transform: translate(11px, -11px);
          white-space: nowrap;
          transition: transform 0.3s ease-in-out;
          background: #f7f7f788;
          border-radius: 7px !important;
          padding: 2px 4px;
          z-index: 1000;
        }
        .connecting {
          transform: translate(11px, -32px);
        }
      `}</style>
    </>
  );
};

export default CustomHandle;
