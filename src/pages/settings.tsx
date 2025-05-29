import { Box, Container, Grid, Typography } from "@mui/material"
import { AuthAction, withUserTokenSSR } from "next-firebase-auth"

import Seo from "../components/Seo"
import ThemeModeToggle from "../components/ThemeModeToggle"

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async () => {
  return {
    props: {},
  }
})

function SettingsPage() {
  return (
    <>
      <Seo title="Settings" />
      <Box sx={{ minHeight: "86vh", py: 5 }}>
        <Container>
          <Grid container spacing={2}>
            <Grid size={{ md: 3, xs: 12 }}></Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography fontWeight="bold">SETTINGS</Typography>
              <ThemeModeToggle />
            </Grid>
            <Grid size={{ md: 3, xs: 12 }}></Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default SettingsPage
