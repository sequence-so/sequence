import { CircularProgress } from "@material-ui/core";
import useTimeout from "@rooks/use-timeout";
import React, { useEffect, useState } from "react";
import { defaultProp } from "services/defaultProp";

interface Props {
  saveText?: string;
  isSaving: boolean;
}

const SavingIndicator = (props: Props) => {
  const [value, setValue] = useState(true);
  const saveText = defaultProp(props.saveText, "Saving...");

  const timeout = useTimeout(() => {
    setValue(false);
  }, 1500);

  useEffect(() => {
    if (props.isSaving) {
      setValue(props.isSaving);
      timeout.start();
    }
  }, [props.isSaving]);

  return (
    <div className="container">
      {value ? (
        <span>
          <CircularProgress
            style={{ width: 16, height: 16, color: "#A5A6B2", marginRight: 4 }}
          />
          {" Saving..."}
        </span>
      ) : (
        <span>{saveText}</span>
      )}
      <style jsx>{`
        .container {
          display: flex;
          align-self: center;
          color: #a5a6b2;
        }
      `}</style>
    </div>
  );
};

export default SavingIndicator;
