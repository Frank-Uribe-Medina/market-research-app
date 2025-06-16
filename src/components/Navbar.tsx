import LogoutIcon from "@mui/icons-material/Logout"
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  useTheme,
} from "@mui/material"
import { useRouter } from "next/router"

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
    </>
  )
}
