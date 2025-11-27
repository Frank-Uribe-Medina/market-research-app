import { Box, Container, Paper, Skeleton, Typography } from "@mui/material"
import { AuthAction, withUserTokenSSR } from "next-firebase-auth"
import React from "react"
import { useSnapshot } from "valtio"

import AddCompetitorForm from "../components/forms/AddCompetitorForm"
import KeyWordTable from "../components/tables/KeyWordTable"
import state from "../contexts/ValtioStore"
import { useGetAllKeyWords } from "../lib/db/hooks/KeyWords"

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  console.log(ctx)
  return {
    props: {},
  }
})

export default function Watchlist() {
  const snap = useSnapshot(state)
  const { data: allKeywords } = useGetAllKeyWords(snap.user?.id ?? "")

  if (!snap.isUserLoaded && snap.user) {
    return (
      <Box>
        {" "}
        <Skeleton></Skeleton>
      </Box>
    )
  }
  if (!snap.user) {
    return (
      <Box>
        {" "}
        <Skeleton>No user </Skeleton>
      </Box>
    )
  }

  return (
    <Container sx={{ height: "86vh" }}>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Typography variant="h6">Competitor Analysis</Typography>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Box>
            <AddCompetitorForm
              isDisabled={false}
              subPlan={"free"}
              count={undefined}
              setIsDisabled={function (): void {
                throw new Error("Function not implemented.")
              }}
              refetchKeywords={function () {
                throw new Error("Function not implemented.")
              }}
              refetching={false}
            />
          </Box>
        </Paper>
        <KeyWordTable
          userId={undefined}
          keywords={allKeywords?.pages[0].content ?? null}
          isDisabled={false}
          setIsDisabled={function (): void {
            throw new Error("Function not implemented.")
          }}
          refetchKeywords={function () {
            throw new Error("Function not implemented.")
          }}
          refetching={false}
        />
      </Box>
    </Container>
  )
}
