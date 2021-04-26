import React, { MouseEventHandler } from "react";
import classNames from "classnames";
import { defaultProp } from "../services/defaultProp";
import styles from "../styles/Home.module.css";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string | JSX.Element;
  onClick?: MouseEventHandler;
  href?: string;
}

const BlueButton = (props: Props) => {
  const onClick = defaultProp(props.onClick, () => {});
  const className = classNames(styles.blue_button, props.className);

  return (
    <button {...props} className={className} onClick={onClick}>
      <p>{props.text}</p>
    </button>
  );
};

export default BlueButton;
