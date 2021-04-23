import React, { useState } from "react";

export type MouseOverIconProps = {
  visible: boolean;
  defaultImage: string;
  hoverImage: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
  ref?: any;
};

/**
 * Changes the image being render by watching for the `onMouseOver` event.
 *
 * @param props
 */
const MouseOverIcon = React.forwardRef(
  (props: MouseOverIconProps, ref: any) => {
    const [isHover, setHover] = useState(false);
    const opacity = props.visible ? 1 : 0;
    const onMouseOver = (): void => setHover(true);
    const onMouseLeave = (): void => setHover(false);

    const inheritedProps: any = { ...props };
    delete inheritedProps.visible;
    delete inheritedProps.defaultImage;
    delete inheritedProps.hoverImage;

    return (
      <div className={props.className} {...inheritedProps} ref={ref}>
        <div
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          onClick={props.onClick}
        >
          <img
            src={isHover ? props.hoverImage : props.defaultImage}
            style={props.style}
          />
          <style jsx>{`
            div {
              display: flex;
              align-self: center;
              padding-left: var(--spacing-xs);
            }
            img {
              opacity: ${opacity};
              transition: opacity 0.1s ease-out;
            }
            img:hover {
              cursor: pointer;
            }
          `}</style>
        </div>
      </div>
    );
  }
);

export default MouseOverIcon;
