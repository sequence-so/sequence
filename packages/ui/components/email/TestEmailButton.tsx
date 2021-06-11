import React, { useCallback, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import BlueButton from "components/BlueButton";
import CreateInput from "components/common/CreateInput";
import { SEND_TEST_EMAIL } from "./EmailQueries";
import { useMutation } from "@apollo/client";
import {
  SendTestEmail,
  SendTestEmailVariables,
} from "__generated__/SendTestEmail";

interface Props {
  emailId: string;
}

const TestEmailButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(localStorage.testEmail);
  const [sendTestEmail] = useMutation<SendTestEmail, SendTestEmailVariables>(
    SEND_TEST_EMAIL
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClickSend = useCallback(() => {
    sendTestEmail({
      variables: {
        to: email,
        emailId: props.emailId,
      },
    }).then(() => handleClose());
  }, []);

  return (
    <div className="container">
      <BlueButton
        text="Send Test Email"
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
          marginLeft: 8,
        }}
      ></BlueButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div className="dialog-inner">
          <h3>Send Test Email</h3>
          <p style={{ fontWeight: 500, marginBlockEnd: 14 }}>To Address:</p>
          <CreateInput
            value={email}
            placeholder="Email address"
            onChangeText={(value) => {
              setEmail(value);
              localStorage.testEmail = value;
            }}
            style={{ marginBottom: 14, width: "100%" }}
          ></CreateInput>
        </div>
        <DialogActions>
          <BlueButton
            text="Cancel"
            onClick={handleClose}
            style={{ background: "none", color: "var(--primary-blue)" }}
          ></BlueButton>
          <BlueButton onClick={onClickSend} text="Send"></BlueButton>
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

export default TestEmailButton;
