import { createTheme } from "@mui/material/styles";

export const getTheme = (themeName = "light") => {
  const isLight = themeName === "light";
  const isDark = themeName === "dark";
  const isRetro = themeName === "retro";
  const isLisa = themeName === "lisaFrank";

  return createTheme({
    palette: {
      mode: isLight ? "light" : "dark",

      primary: {
        main: isRetro ? "#00FF66" : isLisa ? "#ff2fd1" : "#5B2E91",
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: isRetro ? "#00CC44" : isLisa ? "#00e5ff" : "#2E7D32",
      },

      background: isLight
        ? { default: "#F6F4FA", paper: "#FFFFFF" }
        : isDark
          ? { default: "#0F0B14", paper: "#151020" }
          : isRetro
            ? { default: "#050805", paper: "#081108" }
            : {
                // LISA FRANK DARK MODE
                default: "#0b0014",
                paper: "#140028",
              },

      text: isLight
        ? { primary: "#1D1B22", secondary: "#4B4657" }
        : isDark
          ? { primary: "#F0EDF7", secondary: "#BDB6CB" }
          : isRetro
            ? { primary: "#7CFF9E", secondary: "#44C76B" }
            : {
                // LISA FRANK
                primary: "#ffffff",
                secondary: "#ffd6ff",
              },

      divider: isLight
        ? "rgba(91,46,145,0.14)"
        : isDark
          ? "rgba(188,160,255,0.16)"
          : isRetro
            ? "rgba(0,255,102,0.22)"
            : "rgba(255,47,209,0.35)", // Lisa glow divider
    },

    typography: {
      fontFamily: isRetro
        ? '"Courier New","Lucida Console",monospace'
        : isLisa
          ? '"Comic Neue","Baloo 2","Quicksand",sans-serif'
          : '"Roboto","Helvetica","Arial",sans-serif',

      h2: { fontWeight: 900, letterSpacing: isRetro ? 1.1 : -0.5 },
      h4: { fontWeight: 900, letterSpacing: isRetro ? 0.9 : -0.3 },
      button: {
        textTransform: isRetro ? "uppercase" : "none",
        fontWeight: 700,
      },
    },

    shape: { borderRadius: isRetro ? 0 : 18 },

    components: {
      MuiCssBaseline: {
        MuiAppBar: {
          defaultProps: {
            color: "primary",
          },
          styleOverrides: {
            root: ({ theme }) => ({
              color: theme.palette.primary.contrastText,
              backgroundImage: "none", // prevents MUI gradient overlay
            }),
          },
        },
        styleOverrides: {
          body: {
            ...(isRetro && {
              textShadow: "0 0 4px rgba(0,255,102,0.25)",
              backgroundImage:
                "radial-gradient(circle at top, rgba(0,255,102,0.04), transparent 30%)",
            }),

            ...(isLisa && {
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,0,200,0.18), transparent 40%),\
                 radial-gradient(circle at 80% 30%, rgba(0,229,255,0.18), transparent 40%),\
                 radial-gradient(circle at 50% 80%, rgba(255,255,0,0.12), transparent 40%),\
                 #0b0014",
              backgroundAttachment: "fixed",
            }),
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: isRetro ? 0 : 18,

            ...(isRetro && {
              border: "1px solid rgba(0,255,102,0.22)",
              boxShadow: "0 0 10px rgba(0,255,102,0.05)",
            }),

            ...(isLisa && {
              borderRadius: 24,
              boxShadow: "0 0 22px rgba(255,47,209,0.35)",
              border: "1px solid rgba(0,229,255,0.25)",
            }),
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            ...(isRetro && { borderRadius: 0, boxShadow: "none" }),

            ...(isLisa && {
              borderRadius: 999,
              fontWeight: 700,
              boxShadow: "0 0 14px rgba(255,47,209,0.45)",
              transition: "all .2s ease",
              "&:hover": {
                boxShadow: "0 0 20px rgba(0,229,255,0.65)",
                transform: "translateY(-1px)",
              },
            }),
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(isRetro && {
              borderRadius: 0,
              color: "#7CFF9E",
              backgroundColor: "rgba(0,255,102,0.08)",
              borderColor: "rgba(0,255,102,0.3)",
              fontWeight: 700,
            }),

            ...(isLisa && {
              color: "#fff",
              background: "rgba(255,47,209,0.18)",
              borderColor: "rgba(0,229,255,0.45)",
              boxShadow: "0 0 10px rgba(255,47,209,0.35)",
            }),
          }),
        },
      },
    },
  });
};
