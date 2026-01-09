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
              <Grid container>
                <Grid size={{ lg: 2, md: 3, sm: 4 }}>
                  <PermanentDrawerLeft />
                </Grid>
                <Grid size={{ lg: 10, md: 9, sm: 8, xs: 12 }}>
                  {children} <Footer />
                </Grid>
              </Grid>
            </main>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
