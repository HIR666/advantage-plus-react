import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Box,
  Grid2,
  Container,
} from "@mui/material";
// import Grid2 from "@mui/material/Unstable_Grid2"; // Correct import for Grid2
import {
  AddCircleOutline,
  Menu as MenuIcon,
  Home as HomeIcon,
  DescriptionOutlined,
} from "@mui/icons-material";
import { Link, useLocation, Outlet } from "react-router-dom";

const drawerWidth = 220;
const appBarHeight = 64; // MUI default AppBar height (desktop), adjust if needed

const navLinks = [
  { text: "Dashboard Home", icon: <HomeIcon />, path: "/d/" },
  { text: "Add Invoice", icon: <AddCircleOutline />, path: "/d/add-invoice" },
  { text: "Invoices", icon: <DescriptionOutlined />, path: "/d/invoices" }, // New
];

export default function DashboardDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          CRM Dashboard
        </Typography>
      </Toolbar>
      <List>
        {navLinks.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            CRM Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: `calc(100vh - ${appBarHeight}px)`,
          background: (theme) =>
            theme.palette.mode === "dark" ? "#161c24" : "#f4f6f8",
          p: 0,
          mt: `${appBarHeight}px`, // Offset for AppBar
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid2
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%", width: "100%" }}
        >
          <Container
            maxWidth="lg"
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            <Grid2
              container
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Outlet />
            </Grid2>
            {/* <Grid2 size={{ xs: 12, md: 10 }}> */}
          </Container>
          {/* </Grid2> */}
        </Grid2>
      </Box>
    </Box>
  );
}
