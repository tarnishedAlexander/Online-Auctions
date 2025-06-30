import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
// import { useUser } from "../contexts/UserContext";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  isMobile: boolean;
}

const Sidebar = ({
  mobileOpen,
  handleDrawerToggle,
  isMobile,
}: SidebarProps) => {
  const location = useLocation();
  // const { logout } = useUser();
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/app/home"
            selected={location.pathname === "/app/home"}
          >
            <ListItemIcon>
              <BusinessCenterIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/app/adminPanel"
            selected={location.pathname === "/app/adminPanel"}
          >
            <ListItemIcon>
              <BusinessCenterIcon />
            </ListItemIcon>
            <ListItemText primary="Admin panel" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/login"
            selected={location.pathname === "/login"}
            //onClick={logout}
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesion" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
  return (
    <>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
