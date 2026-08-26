import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Stack,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/advantage_new_logo.png";

const NAV = [
  { label: "Services", url: "/#services" },
  { label: "Work", url: "/#work" },
  { label: "Contact", url: "/contact" },
];

export default function MainAppBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        width: "100%",
        background: scrolled
          ? "rgba(5,5,5,0.82)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.86), rgba(0,0,0,0.46) 42%, rgba(0,0,0,0))",
        backdropFilter: scrolled ? "blur(18px)" : "blur(4px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.09)"
          : "1px solid rgba(255,255,255,0)",
        px: { xs: 2, md: 6 },
        py: scrolled ? 1 : 1.5,
        transition:
          "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, padding 0.35s ease",
      }}
    >
      <Toolbar disableGutters sx={{ width: "100%" }}>
        {/* LOGO */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Advantage+"
            sx={{
              height: 26,
              userSelect: "none",
            }}
          />
        </Box>

        {/* DESKTOP NAV */}
        {!isMobile && (
          <Stack direction="row" spacing={1.5}>
            {NAV.map((n) => (
              <Button
                key={n.url}
                onClick={() => navigate(n.url)}
                sx={{
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 0,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  background: "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.14)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    color: "primary.main",
                    background: "rgba(255,255,255,0.04)",
                    borderBottomColor: "primary.main",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {n.label}
              </Button>
            ))}
          </Stack>
        )}

        {/* MOBILE NAV */}
        {isMobile && (
          <>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  background: "rgba(10,15,20,0.95)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 2,
                  mt: 1,
                },
              }}
            >
              {NAV.map((n) => (
                <MenuItem
                  key={n.url}
                  onClick={() => {
                    navigate(n.url);
                    setAnchorEl(null);
                  }}
                >
                  {n.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
