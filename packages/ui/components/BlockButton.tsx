import React, { MouseEvent } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
}

const BlockButton = (props: Props) => {
  const { children, ...otherProps } = props;

  return (
    <button
      className={"block_button"}
      // @ts-ignore
      style={{ "--cursor": "pointer" }}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default BlockButton;
