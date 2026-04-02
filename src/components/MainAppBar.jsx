import React, { useState } from "react";
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

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        width: "100%",

        // 🔥 gradient overlay instead of box
        background: "linear-gradient(to bottom, rgb(0, 0, 0), rgba(0,0,0,0))",

        backdropFilter: "blur(6px)",

        px: { xs: 2, md: 6 },
        py: 1.5,
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
                  px: 2.5,
                  py: 1,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 500,

                  // ✨ subtle button styling
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",

                  transition: "all 0.25s ease",

                  "&:hover": {
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
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
