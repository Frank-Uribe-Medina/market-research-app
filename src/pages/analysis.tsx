import { Box, CircularProgress, Container } from "@mui/material"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import React, { useEffect } from "react"
import { useSnapshot } from "valtio"

import SnapshotsTable from "../components/tables/SnapShotsTable"
import state from "../contexts/ValtioStore"
import { useGetAllKeyWords } from "../lib/db/hooks/KeyWords"
import { User } from "../types/user.model"

interface ReportsPageProps {
  readonly userData: User
}

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  const user = JSON.stringify(ctx.user)
  return {
    props: {
      userData: user,
    },
  }
})

function AnalysisPage({ userData }: ReportsPageProps) {
  console.log(userData)
  const snap = useSnapshot(state)
  const keyword_pages = useGetAllKeyWords(snap.user?.id ?? "")

  useEffect(() => {
    console.log(snap.user?.firstName)
    console.log(keyword_pages.isFetched)
  }, [snap, keyword_pages.isFetched])

  if (!snap.user || !keyword_pages.data) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  if (!snap.user || keyword_pages.isLoading) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  if (!snap.isUserLoaded) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  return (
    <Container sx={{ minHeight: "86vh" }}>
      <Box
        sx={{
          px: 3,
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SnapshotsTable
          keywords_list={keyword_pages.data?.pages[0].content ?? []}
        />
      </Box>
    </Container>
  )
}

export default withUser<ReportsPageProps>()(AnalysisPage)
