import HelpIcon from "@mui/icons-material/Help"
import MenuIcon from "@mui/icons-material/Menu"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { SettingsIcon, ShoppingBasket } from "lucide-react"
import { useRouter } from "next/router"
import * as React from "react"

import Link from "../Link"

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
  // {
  //   name: "Category Planner",
  //   icon: 2,
  //   href: "/",
  //   toolTip: "This is where the cogs of each category lives",
  // },
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

const drawerWidth = 240

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  readonly window?: () => Window
}

export default function PermanentDrawerLeft(props: Props) {
  const router = useRouter()
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)

  const handleClick = (href: string) => {
    handleDrawerToggle()

    router.push(href)
  }
  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  const drawer = (
    <div>
      <Toolbar>
        <Link href={"https://brothersolutions.net"}>
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
            <ListItemButton onClick={() => void handleClick(page.href)}>
              <ListItemIcon>
                {page.icon === 0 && <ShoppingBasket />}
                {page.icon === 1 && <RemoveRedEyeIcon />}
                {page.icon === 3 && <SettingsIcon />}
                {page.icon === 4 && <HelpIcon />}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  )

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Client Login
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
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
    </Box>
  )
}
