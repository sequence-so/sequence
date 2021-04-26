import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  overrides: {
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
