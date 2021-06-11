import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlockButton from "components/BlockButton";
import BlockButtonRow from "components/BlockButtonRow";
import React, { MouseEvent, useState } from "react";

interface Props {
  onDeleteCampaignNode: () => void;
  onOpenUserInspector: () => void;
}

const NodeOptions = (props: Props) => {
  const onClick =
    (name: "delete" | "inspect") =>
    (event: MouseEvent): void => {
      event.stopPropagation();
      if (name === "delete") {
        props.onDeleteCampaignNode();
      } else {
        props.onOpenUserInspector();
      }
    };

  return (
    <div className="options">
      <BlockButtonRow>
        <BlockButton onClick={onClick("delete")}>
          <FontAwesomeIcon icon={faTrashAlt} color={"currentColor"} />
        </BlockButton>
        <BlockButton onClick={onClick("inspect")}>
          <FontAwesomeIcon
            icon={faEye}
            color={"currentColor"}
            onClick={props.onOpenUserInspector}
          />
        </BlockButton>
      </BlockButtonRow>
      <style jsx>{`
        .options {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          left: calc(50% - 16px);
          bottom: -40px;
          background: #ffffff;
          border: 1px solid #c5c5c5;
          height: 32px;
          z-index: 500;
          box-sizing: border-box;
          border-radius: 4px;
          color: var(--title-input-placeholder);
        }
      `}</style>
    </div>
  );
};

export default NodeOptions;
