import React, { createContext, useState } from "react";
import { ElementType } from "./CampaignEditorGrid";

export const DebugNodeContext = createContext({
  elements: [],
  show: false,
  debug: false,
  forceHover: false,
  setShow: (value: boolean) => {},
  setDebug: (value: boolean) => {},
  setForceHover: (value: boolean) => {},
});

interface Props {
  children: React.ReactNode;
  elements: ElementType[];
}

const DebugNodeProvider = (props: Props) => {
  const [show, setShow] = useState(false);
  const [debug, setDebug] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <DebugNodeContext.Provider
      value={{
        elements: props.elements,
        show,
        setShow,
        debug,
        setDebug,
        forceHover: hover,
        setForceHover: (value: boolean) => {
          if (!value) {
            setHover(undefined);
          } else {
            setHover(value);
          }
        },
      }}
    >
      {props.children}
    </DebugNodeContext.Provider>
  );
};

export default DebugNodeProvider;
