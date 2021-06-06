import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import DownArrow from "../public/down_arrow.svg";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import { useIntercom } from "react-use-intercom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faSignOutAlt,
  faQuestionCircle,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
const iconStyle: React.CSSProperties = {
  width: 15,
  marginRight: 8,
  color: "#4E4F55",
};
const GET_USER = gql`
  {
    getUser {
      id
      firstName
      lastName
      email
      photo
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "IBM Plex Sans",
    color: "#4E4F55",
  },
  menu: {
    "& .MuiList-root": {
      paddingTop: 0,
    },
    "& .MuiMenuItem-root": {
      fontFamily: "IBM Plex Sans",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appbar: {
    boxShadow: "none",
    borderBottom: "1px solid #DDDDDD",
  },
  toolbar: {
    minHeight: 50,
    alignItems: "flex-start",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    backgroundColor: "#F9F9F9",
    color: "#4E4F55",
    boxShadow: "none",
    "& .MuiPaper-root": {
      "& .MuiPaper-elevation4": {
        boxShadow: "none",
      },
    },
    "& .MuiPaper-elevation4": {
      boxShadow: "none",
    },
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    alignSelf: "flex-end",
  },
}));

export default function ProminentAppBar() {
  const classes = useStyles();
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_USER);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showingIntercom, setShowingIntercom] = useState(false);
  const [didBootIntercom, setDidBootIntercom] = useState(false);
  const { show, hide, boot } = useIntercom();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHelp = () => {
    if (!didBootIntercom) {
      if (data && data.getUser) {
        boot({
          name: `${data.getUser.firstName} ${data.getUser.lastName}`,
          email: data.getUser.email,
          avatar: data.getUser.logo,
          userId: data.getUser.id,
        });
        hide();
      }
      setDidBootIntercom(true);
      show();
      return;
    }
    setShowingIntercom(!showingIntercom);
    if (showingIntercom) {
      hide();
    } else {
      show();
    }
  };

  const handleSettings = () => {
    handleClose();
    router.push("/settings");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.grow} />
          <IconButton aria-label="search" color="inherit" onClick={handleHelp}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </IconButton>
          <div
            className={styles.profile}
            style={{
              marginTop: 0,
              marginRight: 0,
              alignSelf: "center",
              marginLeft: "auto",
              border: 0,
            }}
            onClick={handleClick}
          >
            {data && data.getUser && data.getUser.photo ? (
              <img
                className={styles.profile_image}
                width={30}
                height={30}
                src={data.getUser.photo}
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ width: "24px", height: "24px" }}
              />
            )}
            <img className={styles.profile_arrow} src={DownArrow} />
          </div>

          <Menu
            id="fade-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            className={classes.menu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div
              style={{
                minWidth: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                background: "#F9F9F9",
                borderBottom: "1px solid #DDDDDD",
                paddingTop: 16,
              }}
            >
              {data && data.getUser && data.getUser.photo ? (
                <img
                  className={styles.profile_image}
                  width={30}
                  height={30}
                  src={data.getUser.photo}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  style={{ width: "45px", height: "45px" }}
                />
              )}
              {data && data.getUser && (
                <p
                  style={{
                    fontSize: "1rem",
                    marginBlockStart: 4,
                    marginBlockEnd: 0,
                    fontWeight: 500,
                  }}
                >
                  {data.getUser.firstName}
                </p>
              )}
              {data && data.getUser && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    marginBlockStart: 4,
                    marginBlockEnd: 12,
                    color: "#4E4F55",
                  }}
                >
                  {data.getUser.email}
                </p>
              )}
            </div>
            <MenuItem
              onClick={handleSettings}
              style={{ paddingTop: 10, paddingBottom: 10 }}
            >
              <FontAwesomeIcon icon={faCog} style={iconStyle} />
              Settings
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              style={{ paddingTop: 10, paddingBottom: 10 }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} style={iconStyle} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}
