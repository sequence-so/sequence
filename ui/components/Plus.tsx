import React from "react";
import PlusDefaultIcon from "../public/plus_default.svg";
import PlusHoverIcon from "../public/plus_hover.svg";
import MouseOverIcon, { MouseOverIconProps } from "./MouseOverIcon";

type OmitKeys = "defaultImage" | "hoverImage";
type PlusProps = Omit<MouseOverIconProps, OmitKeys>;
export type Props = PlusProps;

/**
 * Renders a plus that watches for mouse over events to change the displayed icon.
 *
 * @param props
 */
const Plus = React.forwardRef((props: PlusProps, ref: any) => {
  const ourProps = {
    ...props,
    defaultImage: PlusDefaultIcon,
    hoverImage: PlusHoverIcon,
  };
  return <MouseOverIcon {...ourProps} ref={ref} />;
});

export default Plus;
