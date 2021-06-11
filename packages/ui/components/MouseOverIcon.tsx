import React, { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { defaultProp } from "services/defaultProp";

export interface MouseOverIconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  visible?: boolean;
  defaultImage: string;
  hoverImage: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  ref?: any;
  divStyle?: (isHover: boolean) => React.CSSProperties;
  getStyle?: (isHover: boolean) => React.CSSProperties;
}

/**
 * Changes the image being render by watching for the `onMouseOver` event.
 *
 * @param props
 */
const MouseOverIcon = React.forwardRef(
  (props: MouseOverIconProps, ref: any) => {
    const [isHover, setHover] = useState(false);
    const opacity = defaultProp(props.visible, true) ? 1 : 0;
    const onMouseOver = (): void => setHover(true);
    const onMouseLeave = (): void => setHover(false);
    const onClick = defaultProp(props.onClick, () => {});
    const getStyle = defaultProp(props.getStyle, () => ({}));
    const divStyle = defaultProp(props.divStyle, () => ({}));

    const inheritedProps: any = { ...props };
    delete inheritedProps.visible;
    delete inheritedProps.defaultImage;
    delete inheritedProps.hoverImage;

    return (
      <div
        className={props.className}
        {...inheritedProps}
        style={{ ...divStyle(isHover) }}
        ref={ref}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <img
          src={isHover ? props.hoverImage : props.defaultImage}
          style={{ ...props.style, ...getStyle(isHover) }}
          draggable={false}
        />
        <style jsx>{`
          div {
            display: flex;
            align-self: center;
            padding-left: var(--spacing-xs);
          }
          div:hover {
            cursor: hover;
          }
          img {
            opacity: ${opacity};
            transition: opacity 0.1s ease-out;
            pointer-events: none;
          }
          img:hover {
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
);

export default MouseOverIcon;
