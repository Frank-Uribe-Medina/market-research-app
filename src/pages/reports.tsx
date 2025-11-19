import { Box, CircularProgress, Container, Typography } from "@mui/material"
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
  const kw_from_db = useGetAllKeyWordLists(snap.user?.id)

  return (
    <Container sx={{ height: "86vh" }}>
      <Box sx={{ px: 3, py: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Reports Table
          </Typography>
          {kw_from_db.isLoading ? (
            <>
              <CircularProgress size={50} />
            </>
          ) : (
            <SnapshotsTable
              keywords_list={kw_from_db.data?.pages[0].content ?? []}
            />
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default withUser<ReportsPageProps>()(ReportsPage)
