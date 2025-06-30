import {
  Box,
  CssBaseline,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Sidebar from "./SideBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar onMenuClick={handleDrawerToggle} />
        <Box
          component="main"
          sx={{ p: 3, backgroundColor: "#F9FAFB", minHeight: "100vh" }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
