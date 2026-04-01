import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";

import theme from "./theme"; // ✅ your existing marketing theme

import DashboardDrawer from "./components/DashboardDrawer";
import AddInvoice from "./pages/AddInvoice";
import InvoicesPage from "./pages/Invoices";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import InvoiceDetails from "./pages/InvoiceDetails";

import MainAppBar from "./components/MainAppBar";
import Footer from "./components/Footer";

// Marketing pages
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";

/* -------------------------------------------------- */
/* Layout wrapper that knows about the current route  */
/* -------------------------------------------------- */
function AppLayout() {
  const location = useLocation();

  // 👇 hide marketing UI on dashboard routes
  const isDashboard = location.pathname.startsWith("/d");

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {!isDashboard && <MainAppBar />}

      <Routes>
        {/* -------- PUBLIC MARKETING -------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* -------- DASHBOARD (PROTECTED) -------- */}
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

        {/* -------- REDIRECTS -------- */}
        <Route
          path="/add-invoice"
          element={<Navigate to="/d/add-invoice" replace />}
        />
      </Routes>

      {!isDashboard && <Footer />}
    </Box>
  );
}

/* -------------------------------------------------- */
/* Root App                                           */
/* -------------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
