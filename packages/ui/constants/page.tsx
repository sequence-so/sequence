import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUserFriends,
  faSearch,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
const iconStyle: React.CSSProperties = {
  width: 15,
};

export const PAGE_DEFAULTS = {
  audiences: {
    index: {
      title: "Audiences",
      subtitle: "View and manage your audiences.",
      actionText: "+ Create Audience",
      actionUrl: "/audiences/create",
    },
    id: {
      placeholderTitle: "Untitled Audience",
      subtitle: "View and manage your audiences.",
    },
  },
  explorer: {
    index: {
      title: "User Explorer",
      subtitle: "Filter and search through your User data.",
    },
  },
  events: {
    index: {
      title: "Events Explorer",
      subtitle: "Filter and search through your Events data.",
    },
    id: {
      title: "",
      subtitle: "View the data associated with this Event instance.",
    },
  },
  emails: {
    id: {
      title: "",
      placeholder: "Untitled Email",
      subtitle: "Create an email to send to a list of customers.",
    },
  },
  blasts: {
    index: {
      title: "Blasts",
      subtitle: "View and manage your message blasts.",
      actionText: "+ Send Blast",
      actionUrl: "/blasts/create",
    },
    id: {
      subtitle: "View the details of this Blast.",
    },
    create: {
      subtitle: "Send a blast to an Audience.",
      placeholderTitle: "Untitled Blast",
    },
  },
};

export const SIDEBAR_LIST = [
  {
    section: "Blasts",
    icon: <FontAwesomeIcon icon={faCommentAlt} style={iconStyle} />,
    route: "/blasts",
  },
  {
    section: "Audiences",
    icon: <FontAwesomeIcon icon={faUserFriends} style={iconStyle} />,
    route: "/audiences",
  },
  {
    section: "Emails",
    icon: <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />,
    route: "/emails",
  },
  {
    section: "User Explorer",
    icon: <FontAwesomeIcon icon={faSearch} style={iconStyle} />,
    route: "/explorer",
  },
];
