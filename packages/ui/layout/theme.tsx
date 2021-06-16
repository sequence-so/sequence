import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
  overrides: {
    MuiMenuItem: {
      root: {
        fontFamily: "IBM Plex Sans",
      },
    },
    // @ts-ignore
    MuiAlert: {
      root: {
        fontFamily: "IBM Plex Sans",
      },
    },
    MuiSelect: {
      select: {
        fontFamily: "IBM Plex Sans",
      },
    },
    MuiCssBaseline: {
      "@global": {
        html: {
          fontFamily: "IBM Plex Sans",
        },
      },
    },
  },
});

export default theme;
