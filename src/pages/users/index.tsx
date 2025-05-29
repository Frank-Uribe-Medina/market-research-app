import { Box, Container, Grid, Stack, Typography } from "@mui/material"
import { AuthAction, withUserTokenSSR } from "next-firebase-auth"
import { useState } from "react"

import SearchField from "../../components/SearchField"
import Seo from "../../components/Seo"
import UsersTable from "../../components/tables/Users"

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  const isAdmin = ctx.user?.claims.admin
  if (!isAdmin) {
    return {
      redirect: {
        destination: "/not-authorized",
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
})

export default function UsersPage() {
  const [term, setTerm] = useState("")
  return (
    <>
      <Seo title="Users" />
      <Box sx={{ minHeight: "86vh", py: 5 }}>
        <Container>
          <Grid container spacing={2}>
            <Grid size={{ md: 3, xs: 12 }}></Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography mb={4} fontWeight="bold">
                USERS
              </Typography>
              <Stack spacing={2}>
                <SearchField handleValueChange={(s: string) => setTerm(s)} />
                <UsersTable term={term} />
              </Stack>
            </Grid>
            <Grid size={{ md: 3, xs: 12 }}></Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
