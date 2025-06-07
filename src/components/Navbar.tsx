import LogoutIcon from "@mui/icons-material/Logout"
import MenuIcon from "@mui/icons-material/Menu"
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  useTheme,
} from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"

import { BLUR_DATA_URL } from "../utils"
import Link from "./Link"

type Props = {
  readonly fixed?: boolean
}

const fixedStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 100,
  boxShadow: "none",
}

export default function Navbar({ fixed = false }: Props) {
  const muiTheme = useTheme()
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleLogout = async () => {
    return router.replace("/logout")
  }
  return (
    <>
      <AppBar
        position="static"
        sx={
          fixed
            ? { ...fixedStyle, background: muiTheme.palette.background.default }
            : {
                background: muiTheme.palette.background.default,
                boxShadow: "unset",
              }
        }
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1.5, px: "0 !important" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                // justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: { md: "flex", xs: "none" } }}>
                <Link href="/">
                  <Box sx={{ position: "relative", width: 45, height: 45 }}>
                    <Image
                      src="/assets/images/logo.png"
                      alt="Logo"
                      fill={true}
                      sizes="(max-width: 768px) 75px, (max-width: 1200px) 75px, 75px"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                      }}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </Box>
                </Link>
              </Box>
              <IconButton
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                sx={{ ml: 1 }}
              >
                <MenuIcon className="text-lg" />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  ml: "auto",
                }}
              >
                {/* <ThemeModeToggle /> */}
                <IconButton onClick={() => void handleLogout()}>
                  <LogoutIcon className="text-sm" />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <List>
            <Link href="/">
              <ListItem>
                <ListItemButton>
                  <ListItemText primary={"Dashboard"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/reports">
              <ListItem>
                <ListItemButton>
                  <ListItemText primary={"Reports"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/users">
              <ListItem>
                <ListItemButton>
                  <ListItemText primary={"Users"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/settings">
              <ListItem>
                <ListItemButton>
                  <ListItemText primary={"Settings"} />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>
    </>
  )
}
