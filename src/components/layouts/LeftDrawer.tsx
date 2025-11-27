import DashboardIcon from "@mui/icons-material/Dashboard"
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial"
import HelpIcon from "@mui/icons-material/Help"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import SettingsIcon from "@mui/icons-material/Settings"
import { Tooltip } from "@mui/material"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import * as React from "react"

import Link from "../Link"

const drawerWidth = 240

export default function PermanentDrawerLeft() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box></Box>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          {" "}
          <Link href={"/"}>
            <Box
              sx={{
                objectFit: "contain",
                "&:hover": {
                  opacity: 0.7,
                  transform: "scale(1.05)",
                  transition: "all 0.5s ease-in-out",
                },
              }}
              height={20}
            >
              <img
                src="/assets/images/logo.png"
                alt="Brother Solutions "
                style={{ objectFit: "contain", height: 20 }}
              />
            </Box>
          </Link>
        </Toolbar>
        <Divider />
        <Box></Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton href="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/reports">
              <ListItemIcon>
                <FolderSpecialIcon />
              </ListItemIcon>
              <ListItemText primary={"Reports"} />
            </ListItemButton>
          </ListItem>
          <Tooltip title="Only Accessible for Pro Memebers">
            <ListItem disablePadding>
              <ListItemButton href="/analysis" disabled>
                <ListItemIcon>
                  <RemoveRedEyeIcon />
                </ListItemIcon>
                <ListItemText primary={"Market Analysis"} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
          <ListItem disablePadding>
            <ListItemButton href="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={"Settings"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/help">
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary={"Help"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      ></Box>
    </Box>
  )
}
