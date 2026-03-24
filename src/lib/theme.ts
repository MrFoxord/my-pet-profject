import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0b63ce",
      dark: "#084fa8",
      light: "#4a90ea",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ea5a4",
    },
    background: {
      default: "#f6f8fc",
      paper: "#ffffff",
    },
    text: {
      primary: "#142036",
      secondary: "#5a6780",
    },
    divider: "#dde3ef",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.012em",
    },
    h6: {
      fontWeight: 650,
      letterSpacing: "-0.01em",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.01em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at 12% 12%, rgba(11, 99, 206, 0.08), transparent 40%), radial-gradient(circle at 88% 4%, rgba(14, 165, 164, 0.07), transparent 30%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid rgba(15, 23, 42, 0.06)",
          boxShadow: "0 6px 22px rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 18px rgba(15, 23, 42, 0.12)",
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 14,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "rgba(255, 255, 255, 0.86)",
        },
      },
    },
  },
});

export default theme;