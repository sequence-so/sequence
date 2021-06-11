import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import Snackbar from "@material-ui/core/Snackbar";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 80,
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(5),
    },
  },
  alert: {
    background: "#FFFFFF",
    boxShadow:
      "0px 0px 0px 1px rgba(15, 15, 15, 0.05), 0px 3px 6px rgba(15, 15, 15, 0.1), 0px 9px 24px rgba(15, 15, 15, 0.2)",
    borderRadius: 4,
  },
}));

function CustomAlert(props) {
  const classes = useStyles();
  return (
    <Alert
      className={classes.alert}
      severity="error"
      elevation={6}
      {...props}
    />
  );
}

interface Props {
  text: string;
}

const EditorAlert = (props: Props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    if (props.text) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [props.text]);

  const handleClose = (event, reason) => {
    // if (reason === "clickaway") {
    //   return;
    // }

    setOpen(false);
  };

  const vertical = "top";
  const horizontal = "center";

  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <CustomAlert onClose={handleClose} color="error">
            {props.text}
          </CustomAlert>
        </Snackbar>
      </Collapse>
    </div>
  );
};

export default EditorAlert;
