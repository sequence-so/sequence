import React, { MouseEventHandler } from "react";
import { defaultProp } from "../services/defaultProp";
import styles from "../styles/Home.module.css";

interface Props {
  text: string;
  onClick?: MouseEventHandler;
  href?: string;
}

const BlueButton = (props: Props) => {
  const onClick = defaultProp(props.onClick, () => {});

  return (
    <div className={styles.blue_button} onClick={onClick}>
      <p>{props.text}</p>
    </div>
  );
};

export default BlueButton;
