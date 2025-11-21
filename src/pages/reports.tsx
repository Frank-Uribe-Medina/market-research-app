import { Box, CircularProgress, Container } from "@mui/material"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import React from "react"
import { useSnapshot } from "valtio"

import SnapshotsTable from "../components/tables/SnapShotsTable"
import state from "../contexts/ValtioStore"
import { useGetAllKeyWordLists } from "../lib/db/hooks/KeyWords"
import { BucketsShape } from "../types/snapshots.model"

interface ReportsPageProps {
  readonly initial_data: BucketsShape[]
}

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  console.log(ctx)
  return {
    props: {},
  }
})

function ReportsPage() {
  const snap = useSnapshot(state)
  const keyword_pages = useGetAllKeyWordLists(snap.user?.id)

  return (
    <Container sx={{ height: "content-fit" }}>
      <Box sx={{ px: 3, py: 4 }}>
        {keyword_pages.isLoading ? (
          <>
            <CircularProgress size={50} />
          </>
        ) : (
          <SnapshotsTable
            keywords_list={keyword_pages.data?.pages[0].content ?? []}
          />
        )}
      </Box>
    </Container>
  )
}

export default withUser<ReportsPageProps>()(ReportsPage)
