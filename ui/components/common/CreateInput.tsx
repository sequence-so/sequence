import React, { useState } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  defaultValue?: string;
  onChangeText: (text: string) => void;
}

const CreateInput = (props: Props) => {
  const [state, setState] = useState(props.defaultValue || "");

  return (
    <>
      <input
        className="create-input"
        {...props}
        value={state}
        onChange={(event) => {
          setState(event.target.value);
          props.onChangeText(event.target.value);
        }}
      />
      <style jsx>{`
        .create-input {
          padding: 2px 8px;
          height: 38px;
          color: hsl(0, 0%, 20%);
          border: 1px solid hsl(0, 0%, 80%);
          font-family: 'IBM Plex Sans';
        }
        .create-input:focus {
          border-color: #2684ff;
        }
        }
      `}</style>
    </>
  );
};

export default CreateInput;
