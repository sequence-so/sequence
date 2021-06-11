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

export const CALENDAR_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 3C3.2 3 3 2.8 3 2.5V0.5C3 0.2 3.2 0 3.5 0C3.8 0 4 0.2 4 0.5V2.5C4 2.8 3.8 3 3.5 3Z"
      fill="currentColor"
    />
    <path
      d="M11.5 3C11.2 3 11 2.8 11 2.5V0.5C11 0.2 11.2 0 11.5 0C11.8 0 12 0.2 12 0.5V2.5C12 2.8 11.8 3 11.5 3Z"
      fill="currentColor"
    />
    <path d="M5 1H10V2H5V1Z" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5 15H1.5C0.65 15 0 14.35 0 13.5V2.5C0 1.65 0.55 1 1.25 1H2V2H1.25C1.15 2 1 2.2 1 2.5V4H13.9999L14 2.5C14 2.2 13.85 2 13.75 2H13V1H13.75C14.45 1 15 1.65 15 2.5V13.5C15 14.35 14.35 15 13.5 15ZM3.99994 6H4.99994V7H3.99994V6ZM7 6H6V7H7V6ZM9.00006 6H8.00006V7H9.00006V6ZM9.99994 6H10.9999V7H9.99994V6ZM9.99994 8.00002H10.9999V9.00002H9.99994V8.00002ZM8.00006 8.00002H9.00006V9.00002H8.00006V8.00002ZM6 8.00002H7V9.00002H6V8.00002ZM3.99994 8.00002H4.99994V9.00002H3.99994V8.00002ZM2.00006 8.00002H3.00006V9.00002H2.00006V8.00002ZM9.99994 9.99998H10.9999V11H9.99994V9.99998ZM8.00006 9.99998H9.00006V11H8.00006V9.99998ZM6 9.99998H7V11H6V9.99998ZM3.99994 9.99998H4.99994V11H3.99994V9.99998ZM2.00006 9.99998H3.00006V11H2.00006V9.99998Z"
      fill="currentColor"
    />
  </svg>
);

export const MEGAPHONE_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.555 21.7715C12.5657 21.7715 4.46851 29.8687 4.46851 39.858C4.46851 49.8472 12.5657 57.9444 22.555 57.9444C23.3376 57.9433 24.0941 57.6627 24.688 57.1531C25.282 56.6435 25.6743 55.9385 25.7944 55.1651H25.8464V25.0641C25.8464 24.1911 25.4996 23.3538 24.8824 22.7364C24.2653 22.1189 23.4281 21.7718 22.555 21.7715Z"
      fill="currentColor"
    />
    <path
      d="M95.5329 7.01212C95.5325 6.13928 95.1856 5.30229 94.5685 4.68509C93.9512 4.0679 93.1143 3.72102 92.2415 3.7207C91.4873 3.7207 90.801 3.9846 90.2465 4.4107L61.2835 21.1329H35.1748C34.3018 21.1329 33.4646 21.4797 32.8474 22.097C32.2301 22.7142 31.8834 23.5514 31.8834 24.4243V55.6668H31.9246C32.0211 56.4614 32.4048 57.1933 33.0035 57.7246C33.6021 58.2559 34.3743 58.5499 35.1748 58.5515H58.3419L90.0093 76.8341C90.5964 77.3788 91.3772 77.719 92.2415 77.719C93.1143 77.7186 93.9512 77.3718 94.5685 76.7545C95.1856 76.1374 95.5325 75.3004 95.5329 74.4275C95.5329 74.3029 95.5099 74.1842 95.4966 74.0632H95.5329V7.20338H95.5135C95.5172 7.13922 95.5329 7.0787 95.5329 7.01212Z"
      fill="currentColor"
    />
    <path
      d="M44.8661 88.4686L44.8662 88.3764C44.867 88.3435 44.8759 88.3136 44.8757 88.2799C44.8756 88.2463 44.8676 88.2166 44.8663 88.185L44.8652 68.08H44.8219C44.7755 67.6333 44.6376 67.2009 44.4168 66.8099C44.196 66.4188 43.897 66.0774 43.5385 65.8071L43.5566 65.7756L35.9854 61.4044L35.9745 61.4233C35.5377 61.2128 35.0595 61.1024 34.5747 61.1001C34.1424 61.1 33.7143 61.1851 33.315 61.3504C32.9156 61.5158 32.5528 61.7583 32.2472 62.0639C31.9415 62.3696 31.6992 62.7324 31.5338 63.1317C31.3685 63.5312 31.2835 63.9592 31.2836 64.3914C31.2841 64.5455 31.3078 64.6933 31.3297 64.8416L31.2847 64.8422L31.284 88.2744L31.2831 88.2809C31.283 88.2828 31.2832 88.2849 31.2838 88.2868V88.5217L31.3077 88.5215C31.3663 89.3483 31.7356 90.1224 32.3416 90.6879C32.9475 91.2535 33.7451 91.5687 34.5739 91.5703C34.7768 91.5699 34.974 91.5454 35.166 91.5108L35.1661 91.5711L42.1308 91.5721L42.1309 91.5163C42.8632 91.3922 43.5317 91.023 44.0269 90.4694C44.522 89.9157 44.8145 89.2102 44.8563 88.4686H44.8661Z"
      fill="currentColor"
    />
  </svg>
);

export const PAGE_DEFAULTS = {
  audiences: {
    icon: <FontAwesomeIcon icon={faUserFriends} style={iconStyle} />,
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
  campaigns: {
    icon: CALENDAR_ICON,
    index: {
      title: "Campaigns",
      subtitle:
        "View all of the campaigns you've created and sent to customers.",
      actionUrl: "/campaigns/create",
      actionText: "+ Create Campaign",
    },
  },
  explorer: {
    icon: <FontAwesomeIcon icon={faSearch} style={iconStyle} />,
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
    icon: <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />,
    index: {
      title: "Emails",
      subtitle: "View all of the emails you've created and sent to customers.",
      actionUrl: "/emails/create",
      actionText: "+ Create Email",
    },
    id: {
      title: "",
      placeholder: "Untitled Email",
      subtitle: "Create an email to send to a list of customers.",
    },
  },
  blasts: {
    icon: MEGAPHONE_ICON,
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
    section: "Campaigns",
    icon: PAGE_DEFAULTS.campaigns.icon,
    route: "/campaigns",
  },
  {
    section: "Blasts",
    icon: PAGE_DEFAULTS.blasts.icon,
    route: "/blasts",
  },
  {
    section: "Audiences",
    icon: PAGE_DEFAULTS.audiences.icon,
    route: "/audiences",
  },
  {
    section: "Emails",
    icon: PAGE_DEFAULTS.emails.icon,
    route: "/emails",
  },
  {
    section: "User Explorer",
    icon: PAGE_DEFAULTS.explorer.icon,
    route: "/explorer",
  },
];
