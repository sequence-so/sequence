import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import BlueButton from "components/BlueButton";

import EmailRenderer from "./EmailRenderer";

interface Props {
  html: string;
}

const PreviewCodeEmailButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="container">
      <BlueButton
        text="Open Email Preview"
        onClick={handleClickOpen}
        style={{
          marginTop: 0,
          marginBottom: 0,
          height: 35,
          width: "auto",
          paddingLeft: 15,
          paddingRight: 15,
          minWidth: 100,
          marginRight: 0,
        }}
      ></BlueButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <EmailRenderer html={props.html} />
        <DialogActions>
          <BlueButton
            text="Close"
            onClick={handleClose}
            style={{ background: "none", color: "var(--primary-blue)" }}
          ></BlueButton>
        </DialogActions>
      </Dialog>
      <style jsx>{`
        .container {
          display: flex;
          align-self: flex-end;
        }
        .dialog-inner {
          padding-left: 20px;
          padding-right: 20px;
          min-width: 450px;
        }
      `}</style>
    </div>
  );
};

export default PreviewCodeEmailButton;
