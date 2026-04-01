import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#E3FC7B",
    },
    secondary: {
      main: "#008BF8",
    },
    background: {
      default: "#0B0F14",
      paper: "rgba(255,255,255,0.06)",
    },
    text: {
      primary: "#F3F4F6",
      secondary: "#9CA3AF",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: `"Inter", system-ui, sans-serif`,
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(227,252,123,0.14), transparent 60%)",
          backgroundColor: "#0B0F14",
        },
      },
    },
  },
});

export default theme;
