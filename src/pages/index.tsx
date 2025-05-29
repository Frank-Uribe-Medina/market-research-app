import { Box, Button, Container, Grid, Typography } from "@mui/material"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import { useEffect } from "react"
import { useSnapshot } from "valtio"

import AddKeyWord from "../components/AddKeyWord"
import MarketPlaces from "../components/Marketplaces"
import QuantitySelect from "../components/QuantitySelect"
import Seo from "../components/Seo"
import KeyWordTable from "../components/tables/KeyWordTable"
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
            <Grid size={12}>
              <Box>
                <Typography>
                  Market Recon- Cross Market Price Research
                </Typography>
              </Box>
              <Box>
                <AddKeyWord />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box>
                <MarketPlaces />
              </Box>
            </Grid>
            <Grid size={6}>
              <QuantitySelect />
            </Grid>
            <Grid size={12}>
              <KeyWordTable />
            </Grid>
            <Grid size={12}>
              <Button variant="outlined"> Save Search</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default withUser()(HomePage)
