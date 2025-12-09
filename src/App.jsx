import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import DashboardDrawer from "./components/DashboardDrawer";
import AddInvoice from "./pages/AddInvoice";
import InvoicesPage from "./pages/Invoices";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import InvoiceDetails from "./pages/InvoiceDetails";

// Demo Home
function Home() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
      }}
    >
      Welcome to the CRM Dashboard!
    </div>
  );
}

// ----------- THEME SETUP -----------

// Glassy effect colors
const darkGlassyTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffd700", // Gold accent
    },
    secondary: {
      main: "#00b0ff", // Blue accent
    },
    background: {
      default: "rgba(20,24,28,0.92)",
      paper: "rgba(36,40,44,0.74)",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          // Glass/frosted effect
          backgroundColor: "rgba(36,40,44,0.40)",
          backdropFilter: "blur(4px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(24,26,28,0.40)",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.24)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "rgba(22,24,28,0.85)",
          backdropFilter: "blur(10px)",
          borderRight: "1.5px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "Noto Kufi Arabic",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
    h5: {
      fontWeight: 700,
      letterSpacing: 0.4,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
    },
  },
});

export default function App() {
  return (
    <AuthProvider>
      {" "}
      {/* 👈 wrap everything */}
      <ThemeProvider theme={darkGlassyTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />

            {/* Protected dashboard */}
            <Route
              path="/d/*"
              element={
                <ProtectedRoute>
                  <DashboardDrawer />
                </ProtectedRoute>
              }
            >
              <Route index element={<div>Dashboard Home</div>} />
              <Route path="add-invoice" element={<AddInvoice />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="invoices/:id" element={<InvoiceDetails />} />
            </Route>

            <Route
              path="/add-invoice"
              element={<Navigate to="/d/add-invoice" />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
