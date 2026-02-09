import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#5B2E91" },   // purple
      secondary: { main: "#2E7D32" }, // green

      ...(mode === "light"
        ? {
            background: {
              default: "#F6F4FA",
              paper: "#FFFFFF",
            },
            text: {
              primary: "#1D1B22",
              secondary: "#4B4657",
            },
            divider: "rgba(91, 46, 145, 0.14)",
          }
        : {
            background: {
              default: "#0F0B14",
              paper: "#151020",
            },
            text: {
              primary: "#F0EDF7",
              secondary: "#BDB6CB",
            },
            divider: "rgba(188, 160, 255, 0.16)",
          }),
    },

    typography: {
      h2: { fontWeight: 900, letterSpacing: -0.5 },
      h4: { fontWeight: 900, letterSpacing: -0.3 },
      button: { textTransform: "none", fontWeight: 700 },
    },

    shape: { borderRadius: 18 },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(10px)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
          },
        },
      },
    },
  });
