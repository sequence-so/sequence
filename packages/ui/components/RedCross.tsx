import RedXDefaultIcon from "../public/red_x_default.svg";
import RedXHoverIcon from "../public/red_x_hover.svg";
import MouseOverIcon, { MouseOverIconProps } from "./MouseOverIcon";

type OmitKeys = "defaultImage" | "hoverImage";
type RedCrossProps = Omit<MouseOverIconProps, OmitKeys>;

/**
 * Renders a red cross that watches for mouse over events to change the displayed icon.
 *
 * @param props
 */
const RedCross = (props: RedCrossProps) => {
  const ourProps = {
    ...props,
    defaultImage: RedXDefaultIcon,
    hoverImage: RedXHoverIcon,
  };
  return <MouseOverIcon {...ourProps} />;
};

export default RedCross;
