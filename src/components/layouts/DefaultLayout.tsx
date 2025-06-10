import { Box, Grid, useTheme } from "@mui/material"
import { ReactNode } from "react"

import Footer from "./Footer"
import Header from "./Header"
import PermanentDrawerLeft from "./LeftDrawer"

interface Props {
  readonly children: ReactNode
}

export default function DefaultLayout({ children }: Props) {
  const theme = useTheme()

  return (
    <Box className={theme.palette.mode === "dark" ? "darkMode" : "lightMode"}>
      <Box sx={{ minHeight: "100vh" }}>
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <Header />

            <main className="App">
              <PermanentDrawerLeft />
              {children}
            </main>
            <Footer />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
