import React, { useEffect, useState } from "react";
import useDebugNode from "hooks/useDebugNode";
import BlockButton from "components/BlockButton";
import GrabberIcon from "public/grabber.svg";

interface Props {}

const DebugNodeWindow = (props: Props) => {
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  const {
    show,
    setShow,
    debug,
    setDebug,
    setForceHover,
    forceHover,
    elements,
  } = useDebugNode();

  useEffect(() => {
    (window as any).debugNodes = (): void => {
      setShow(true);
    };
  }, []);

  if (!show) {
    return null;
  }

  const printNodes = () => {
    console.log({ nodes: elements });
  };

  return (
    <div className="container">
      {/* <BlockButton
        draggable
        onDragStart={(e) => {
          console.log({ x: e.screenX, y: e.screenY });
        }}
        style={{
          // @ts-ignore
          "--cursor": "grab",
        }}
      >
        <img src={GrabberIcon} />
      </BlockButton> */}
      <span>Node Debugger</span>
      <div>
        <input
          type="checkbox"
          name="show"
          checked={show}
          onChange={(e) => {
            setShow(e.target.checked);
          }}
        ></input>
        <label htmlFor="show">Show window</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="debug"
          checked={debug}
          onChange={(e) => {
            setDebug(e.target.checked);
          }}
        ></input>
        <label htmlFor="debug">Enable debug nodes</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="hover"
          checked={forceHover}
          onChange={(e) => {
            setForceHover(e.target.checked);
          }}
        ></input>
        <label htmlFor="hover">Force hover</label>
      </div>
      <div>
        <button name="print_nodes" onClick={printNodes}>
          Print nodes
        </button>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          position: absolute;
          bottom: 100px;
          right: 100px;
          width: 200px;
          z-index: 1000;
          box-shadow: var(--subtle-shadow);
          border-radius: 6px;
          padding: 6px;
          background: white;
        }
        .container > * + * {
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default DebugNodeWindow;
