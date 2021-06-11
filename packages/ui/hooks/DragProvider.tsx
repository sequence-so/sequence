import React, { useEffect, useState } from "react";

export const DraggingContext = React.createContext<{ isDragging: boolean }>({
  isDragging: false,
});

interface Props {
  children: React.ReactNode;
}

const DragProvider = (props: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const mouseDownHandler = () => {
      setIsDragging(false);
    };
    const mouseMoveHandler = () => {
      setIsDragging(true);
    };
    document.addEventListener("mousedown", mouseDownHandler);
    document.addEventListener("mousemove", mouseMoveHandler);
    return () => {
      document.removeEventListener("mousedown", mouseDownHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <DraggingContext.Provider value={{ isDragging }}>
      {props.children}
    </DraggingContext.Provider>
  );
};

export default DragProvider;
