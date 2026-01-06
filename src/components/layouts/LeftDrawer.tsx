import DashboardIcon from "@mui/icons-material/Dashboard"
import HelpIcon from "@mui/icons-material/Help"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import SettingsIcon from "@mui/icons-material/Settings"
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
import { ShoppingBasket } from "lucide-react"
import * as React from "react"

import Link from "../Link"

const drawerWidth = 240

const pages = [
  {
    name: "Product Planner",
    icon: 0,
    href: "/",
    toolTip: "Add keywords here",
  },
  {
    name: "Product Anaylsis",
    icon: 1,
    href: "/analysis",
    toolTip: "This is where the cogs of each product lives",
  },
  {
    name: "Category Planner",
    icon: 2,
    href: "/",
    toolTip: "This is where the cogs of each category lives",
  },
  {
    name: "Settings",
    icon: 3,
    href: "/settings",
    toolTip: "Reset password, change preferences",
  },
  {
    name: "Help",
    icon: 4,
    href: "/help",
    toolTip:
      "General FAQs About 3PL, and other tutorials on infering this data",
  },
]

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
        <List>
          {pages.map((page) => (
            <ListItem disablePadding key={page.name}>
              <ListItemButton href={page.href}>
                <ListItemIcon>
                  {page.icon === 0 && <ShoppingBasket />}
                  {page.icon === 1 && <RemoveRedEyeIcon />}
                  {page.icon === 2 && <DashboardIcon />}
                  {page.icon === 3 && <SettingsIcon />}
                  {page.icon === 4 && <HelpIcon />}
                </ListItemIcon>
                <ListItemText primary={page.name} />
              </ListItemButton>
            </ListItem>
          ))}
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
