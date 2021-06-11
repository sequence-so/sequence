import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import styles from "../styles/Home.module.css";
import Logo from "../public/main_logo.svg";
import LogoSquare from "../public/logo_square.svg";
import classNames from "classnames";
import { SidebarItemProp } from "./DashboardSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useGlobalState } from "../layout/DashboardLayout";
import BlueButton from "./BlueButton";
import { makeStyles, Menu, MenuItem } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import { useRouter } from "next/router";
import { PAGE_DEFAULTS } from "constants/page";

interface SidebarProps {
  index: number;
  items: SidebarItemProp[];
  onClick: (index: number) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "IBM Plex Sans",
    color: "#4E4F55",
  },
  menu: {
    "& .MuiList-root": {
      paddingTop: 0,
      width: 200,
    },
    "& .MuiMenuItem-root": {
      fontFamily: "IBM Plex Sans",
      color: "#4E4F55",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const NewActionMenu = ({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: any;
  setAnchorEl: any;
}) => {
  const classes = useStyles();
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    handleClose();
  };

  const handleRoute = (url: string) => {
    if (router.pathname === url) {
      return handleClose();
    }
    router.push(url);
  };
  const handleSendMesage = () => {
    handleRoute("/blasts/create");
  };
  const handleCreateEmail = () => {
    handleRoute("/emails/create");
  };
  const handleCreateAudience = () => {
    handleRoute("/audiences/create");
  };

  return (
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
        horizontal: "left",
      }}
      getContentAnchorEl={null}
      transformOrigin={{
        vertical: 0,
        horizontal: 0,
      }}
    >
      <MenuItem
        onClick={handleSendMesage}
        style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        <>
          {PAGE_DEFAULTS.blasts.icon}
          <span style={{ marginLeft: 8 }}>Send Blast</span>
        </>
      </MenuItem>
      <MenuItem
        onClick={handleCreateAudience}
        style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        <>
          {PAGE_DEFAULTS.audiences.icon}
          <span style={{ marginLeft: 8 }}>New Audience</span>
        </>
      </MenuItem>
      <MenuItem
        onClick={handleCreateEmail}
        style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        <>
          {PAGE_DEFAULTS.emails.icon}
          <span style={{ marginLeft: 8 }}>New Email</span>
        </>
      </MenuItem>
    </Menu>
  );
};

const Sidebar = (props: SidebarProps) => {
  const [isSidebarOpen, setSidebarOpen] = useGlobalState("isSidebarOpen");
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div
      className={classNames(
        styles.sidebar,
        styles.dashboard_sidebar,
        !isSidebarOpen ? styles.collapsed_sidebar : ""
      )}
    >
      <img
        className={styles.sidebar_logo}
        src={Logo}
        style={{ display: isSidebarOpen ? "initial" : "none" }}
      />
      <img
        src={LogoSquare}
        style={{
          display: !isSidebarOpen ? "initial" : "none",
          height: 28,
          marginTop: 24,
          marginBottom: 18,
          alignSelf: "center",
        }}
      />
      <BlueButton
        className={classNames(
          isSidebarOpen
            ? styles.sidebar_action_button
            : styles.sidebar_action_button_closed
        )}
        text={
          <>
            <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
            {isSidebarOpen ? " New" : ""}
          </>
        }
        onClick={handleClick}
      ></BlueButton>
      <NewActionMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      {props.items.map(({ section, icon, style, renderIcon }, idx) => {
        let newStyle = { ...style };
        if (!isSidebarOpen) {
          newStyle.marginBottom = 8;
        }
        return (
          <SidebarItem
            key={section}
            active={idx === props.index}
            name={section}
            icon={icon}
            onClick={() => {
              props.onClick(idx);
            }}
            renderIcon={renderIcon}
            style={newStyle}
            isSidebarOpen={isSidebarOpen}
          />
        );
      })}
      <div
        className={styles.sidebar_collapse}
        style={{
          marginTop: "auto",
          justifySelf: "flex-end",
        }}
        onClick={(): void => {
          setSidebarOpen(!isSidebarOpen);
        }}
      >
        <FontAwesomeIcon
          icon={isSidebarOpen ? faArrowLeft : faArrowRight}
          style={{ marginLeft: "auto", marginRight: 4 }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
