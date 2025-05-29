import { Box, Container, Grid, Typography } from "@mui/material"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import { useEffect } from "react"
import { useSnapshot } from "valtio"

import DELETETHIS from "../components/DELETE_THIS"
import Seo from "../components/Seo"
import state from "../contexts/ValtioStore"

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  console.log(ctx.user?.claims)
  return {
    props: {},
  }
})

function HomePage() {
  const snap = useSnapshot(state)

  useEffect(() => {
    console.log(snap.user)
  }, [snap.user])

  return (
    <>
      <Seo title="Home" />
      <Box sx={{ minHeight: "86vh", py: 5 }}>
        <Container>
          <Grid container spacing={2}>
            <Grid size={{ md: 3, xs: 12 }}></Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography align="center" className="text-md">
                  Give your self admin first!{" "}
                </Typography>
                <Typography
                  align="center"
                  color="error"
                  fontWeight="bold"
                  mt={4}
                >
                  * Delete DELETE_THIS.tsx component file after!!!!
                  <br />* Delete /api/user/delete_this route file!!!
                </Typography>
                <DELETETHIS />
              </Box>
            </Grid>
            <Grid size={{ md: 3, xs: 12 }}></Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default withUser()(HomePage)
