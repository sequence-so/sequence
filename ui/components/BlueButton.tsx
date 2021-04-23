import React, { MouseEventHandler } from "react";
import { defaultProp } from "../services/defaultProp";
import styles from "../styles/Home.module.css";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  onClick?: MouseEventHandler;
  href?: string;
}

const BlueButton = (props: Props) => {
  const onClick = defaultProp(props.onClick, () => {});

  return (
    <button className={styles.blue_button} onClick={onClick} {...props}>
      <p>{props.text}</p>
    </button>
  );
};

export default BlueButton;
