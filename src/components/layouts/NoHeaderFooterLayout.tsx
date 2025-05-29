import { Box, Grid, useTheme } from "@mui/material"
import { ReactNode } from "react"

import ThemeModeToggle from "../ThemeModeToggle"

interface Props {
  readonly children: ReactNode
}

export default function NoHeaderFooterLayout({ children }: Props) {
  const theme = useTheme()

  return (
    <Box className={theme.palette.mode === "dark" ? "darkMode" : "lightMode"}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <main className="App" style={{ width: "100%" }}>
          <Grid container>
            <Grid size={{ md: 4, xs: 12 }}></Grid>
            <Grid size={{ md: 4, xs: 12 }}>
              {children}
              <Box sx={{ position: "fixed", top: 5, right: 10 }}>
                <ThemeModeToggle />
              </Box>
            </Grid>
            <Grid size={{ md: 4, xs: 12 }}></Grid>
          </Grid>
        </main>
      </Box>
    </Box>
  )
}
