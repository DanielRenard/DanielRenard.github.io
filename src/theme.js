import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
    },
  },
  typography: {
    h2: { fontWeight: 800 },
    h4: { fontWeight: 800 },
  },
  shape: { borderRadius: 16 },
});

export default theme;

