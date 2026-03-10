import { createTheme } from "@mui/material/styles";

export const getTheme = (themeName = "light") => {
  const isLight = themeName === "light";
  const isDark = themeName === "dark";
  const isRetro = themeName === "retro";

  return createTheme({
    palette: {
      mode: isLight ? "light" : "dark",

      primary: {
        main: isRetro ? "#00FF66" : "#5B2E91",
      },
      secondary: {
        main: isRetro ? "#00CC44" : "#2E7D32",
      },

      background: isLight
        ? {
            default: "#F6F4FA",
            paper: "#FFFFFF",
          }
        : isDark
        ? {
            default: "#0F0B14",
            paper: "#151020",
          }
        : {
            default: "#050805",
            paper: "#081108",
          },

      text: isLight
        ? {
            primary: "#1D1B22",
            secondary: "#4B4657",
          }
        : isDark
        ? {
            primary: "#F0EDF7",
            secondary: "#BDB6CB",
          }
        : {
            primary: "#7CFF9E",
            secondary: "#44C76B",
          },

      divider: isLight
        ? "rgba(91, 46, 145, 0.14)"
        : isDark
        ? "rgba(188, 160, 255, 0.16)"
        : "rgba(0,255,102,0.22)",
    },

    typography: {
      fontFamily: isRetro
        ? '"Courier New", "Lucida Console", monospace'
        : '"Roboto", "Helvetica", "Arial", sans-serif',

      h2: {
        fontWeight: 900,
        letterSpacing: isRetro ? 1.1 : -0.5,
        textTransform: isRetro ? "uppercase" : "none",
      },
      h4: {
        fontWeight: 900,
        letterSpacing: isRetro ? 0.9 : -0.3,
        textTransform: isRetro ? "uppercase" : "none",
      },
      button: {
        textTransform: isRetro ? "uppercase" : "none",
        fontWeight: 700,
        letterSpacing: isRetro ? 0.8 : 0,
      },
      body1: {
        lineHeight: isRetro ? 1.7 : 1.5,
      },
      body2: {
        lineHeight: isRetro ? 1.7 : 1.43,
      },
    },

    shape: {
      borderRadius: isRetro ? 0 : 18,
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            ...(isRetro && {
              textShadow: "0 0 4px rgba(0,255,102,0.25)",
              backgroundImage:
                "radial-gradient(circle at top, rgba(0,255,102,0.04), transparent 30%)",
            }),
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: isRetro ? "none" : "blur(10px)",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: isRetro ? 0 : 18,
            ...(isRetro && {
              border: "1px solid rgba(0,255,102,0.22)",
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,255,102,0.03), rgba(0,0,0,0.08))",
              boxShadow: "0 0 10px rgba(0,255,102,0.05)",
            }),
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            ...(themeName === "dark" && {
              color: "#FFFFFF",
              backgroundColor: "rgba(255,255,255,0.12)",
              borderColor: "rgba(255,255,255,0.55)",
              fontWeight: 500,
            }),

            ...(themeName === "dark" &&
              ownerState.color === "secondary" && {
                backgroundColor: "rgba(46,125,50,0.45)",
                borderColor: "rgba(46,125,50,0.9)",
                color: "#E9F5EC",
              }),

            ...(themeName === "dark" &&
              ownerState.color === "primary" && {
                backgroundColor: "rgba(91,46,145,0.45)",
                borderColor: "rgba(188,160,255,0.9)",
                color: "#F4EEFF",
              }),

            ...(isRetro && {
              borderRadius: 0,
              color: "#7CFF9E",
              backgroundColor: "rgba(0,255,102,0.08)",
              borderColor: "rgba(0,255,102,0.3)",
              fontWeight: 700,
              letterSpacing: 0.7,
            }),

            ...(isRetro &&
              ownerState.color === "secondary" && {
                backgroundColor: "rgba(0,204,68,0.10)",
                borderColor: "rgba(0,204,68,0.42)",
                color: "#84FFA9",
              }),

            ...(isRetro &&
              ownerState.color === "primary" && {
                backgroundColor: "rgba(0,255,102,0.10)",
                borderColor: "rgba(0,255,102,0.5)",
                color: "#A6FFC0",
              }),
          }),

          outlined: ({ theme }) => ({
            ...(theme.palette.mode === "dark" && {
              borderWidth: 1.5,
            }),
            ...(isRetro && {
              borderWidth: 1,
            }),
          }),
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            ...(isRetro && {
              borderRadius: 0,
              boxShadow: "none",
            }),
          },
          containedPrimary: {
            ...(isRetro && {
              background: "#0B1A0E",
              color: "#7CFF9E",
              border: "1px solid rgba(0,255,102,0.4)",
              "&:hover": {
                background: "#102513",
                boxShadow: "0 0 10px rgba(0,255,102,0.12)",
              },
            }),
          },
          outlinedPrimary: {
            ...(isRetro && {
              borderColor: "#00FF66",
              color: "#7CFF9E",
              "&:hover": {
                backgroundColor: "rgba(0,255,102,0.08)",
              },
            }),
          },
        },
      },
    },
  });
};