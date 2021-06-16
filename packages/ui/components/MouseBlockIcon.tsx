import React, { useState } from "react";
import { defaultProp } from "services/defaultProp";

export type MouseBlockIconProps = {
  image: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  ref?: any;
};

/**
 * Changes the image being render by watching for the `onMouseOver` event.
 *
 * @param props
 */
const MouseBlockIcon = React.forwardRef(
  (props: MouseBlockIconProps, ref: any) => {
    const inheritedProps: any = { ...props };
    delete inheritedProps.visible;
    delete inheritedProps.defaultImage;
    delete inheritedProps.hoverImage;

    return (
      <div className={props.className} {...inheritedProps} ref={ref}>
        <img src={props.image} style={props.style} />
        <style jsx>{`
          div {
            display: flex;
            align-self: center;
            padding-left: var(--spacing-xs);
            width: 27px;
            height: 27px;
            padding: 5px;
          }
          div:hover {
            background-color: #e5e5e5;
            border-radius: 3px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
);

export default MouseBlockIcon;
