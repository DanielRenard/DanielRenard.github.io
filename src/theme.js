import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#5B2E91" }, // purple
      secondary: { main: "#2E7D32" }, // green

      ...(mode === "light"
        ? {
            background: {
              default: "#F6F4FA", // light lavender tint (easy on eyes)
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
              primary: "#F0EDF7", // ✅ brighter for readability
              secondary: "#BDB6CB", // ✅ readable secondary text
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
      MuiChip: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            ...(theme.palette.mode === "dark" && {
              // 🔴 TEXT: force high contrast
              color: "#FFFFFF",

              // 🔴 BACKGROUND: darker so text pops
              backgroundColor: "rgba(255,255,255,0.12)",

              // 🔴 BORDER: clearly visible
              borderColor: "rgba(255,255,255,0.55)",

              fontWeight: 500,
            }),

            // 🟢 Secondary (green) chips — intentionally green
            ...(theme.palette.mode === "dark" &&
              ownerState.color === "secondary" && {
                backgroundColor: "rgba(46,125,50,0.45)",
                borderColor: "rgba(46,125,50,0.9)",
                color: "#E9F5EC",
              }),

            // 🟣 Primary (purple) chips — optional but consistent
            ...(theme.palette.mode === "dark" &&
              ownerState.color === "primary" && {
                backgroundColor: "rgba(91,46,145,0.45)",
                borderColor: "rgba(188,160,255,0.9)",
                color: "#F4EEFF",
              }),
          }),

          outlined: ({ theme }) => ({
            ...(theme.palette.mode === "dark" && {
              borderWidth: 1.5,
            }),
          }),
        },
      },
    },
  });
