import React, { useState } from "react";
import {
  AppBar,
  Button,
  Container,
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
import Logo from "../assets/advantage_main_logo.png";

const NAV = [
  { label: "Services", url: "/" },
  { label: "Work", url: "/" },
  { label: "Contact", url: "/contact" },
];

export default function MainAppBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Box sx={{ mt: 3, mx: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          mx: "auto",
          maxWidth: "lg",
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ px: 3 }}>
            {/* LOGO (acts like Typography with flexGrow) */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <Box
                component="img"
                src={Logo}
                alt="Advantage+"
                sx={{
                  height: 25,
                  userSelect: "none",
                }}
              />
            </Box>

            {/* DESKTOP NAV */}
            {!isMobile && (
              <Stack direction="row" spacing={2}>
                {NAV.map((n) => (
                  <Button
                    key={n.url}
                    color="inherit"
                    onClick={() => navigate(n.url)}
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
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      background: "rgba(10,15,20,0.9)",
                      backdropFilter: "blur(16px)",
                      borderRadius: 2,
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
        </Container>
      </AppBar>
    </Box>
  );
}
