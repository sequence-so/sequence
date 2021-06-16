import React from "react";
import styles from "./block.module.css";

interface Props {
  children?: React.ReactNode;
}

const BlockButtonRow = (props: Props) => {
  return <div className={"block_row"}>{props.children}</div>;
};

export default BlockButtonRow;
