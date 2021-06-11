import React from "react";

export const isClassComponent = (component: any): boolean => {
  return (
    typeof component === "function" && !!component.prototype.isReactComponent
  );
};

export const isElement = (element: any): boolean => {
  return React.isValidElement(element);
};

export const isDOMTypeElement = (element: any): boolean => {
  return isElement(element) && typeof element.type === "string";
};
