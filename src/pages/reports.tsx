import { Box, Container, Skeleton, Typography } from "@mui/material"
import axios from "axios"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import React, { useCallback, useEffect } from "react"
import { toast } from "react-toastify"
import { useSnapshot } from "valtio"

import SnapshotsTable from "../components/tables/SnapShotsTable"
import state from "../contexts/ValtioStore"
import { SnapShotActions } from "../lib/db/actions/Snapshots"
import { BucketsShape } from "../types/snapshots.model"
import { formatFirebaseDate } from "../utils"

interface ReportsPageProps {
  readonly bucketsData?: BucketsShape[]
}

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  console.log(ctx.user?.claims)
  const buckets = await SnapShotActions.GetAllSnapShotBuckets(
    ctx.user?.id ? ctx.user.id : "",
    10
  )

  const setUpBuckets: BucketsShape[] = buckets.content as BucketsShape[]

  const formated_buckets: BucketsShape[] = []
  setUpBuckets.forEach((item) => {
    const newBucket: BucketsShape = {
      id: item.id ?? "",
      name: item.name ?? "",
      createdAt: formatFirebaseDate(item?.createdAt),
      snapshots: item?.snapshots,
      ready: item?.ready,
    }
    formated_buckets.push(newBucket)
  })

  return {
    props: {
      bucketsData: formated_buckets,
    },
  }
})

function ReportsPage({ bucketsData }: ReportsPageProps) {
  const snap = useSnapshot(state)

  const getProgress = useCallback(async () => {
    const data = { userId: snap.user?.id, listIds: bucketsData }
    await axios
      .post("/api/checkstatus/", data)
      .then((response) => {
        console.log("Grabbed Data.", response.data)
      })
      .catch((response) => {
        toast.error(response)
      })
  }, [snap.user?.id, bucketsData])
  useEffect(() => {
    const interval = setInterval(() => {
      getProgress()
    }, 5000)
    //This part is cleanup
    return () => clearInterval(interval)
  }, [getProgress]) //Rerun this whenever the user changes essentially

  return (
    <Container sx={{ height: "86vh" }}>
      <Box sx={{ px: 3, py: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Reports Table
        </Typography>

        {bucketsData && snap.user?.id ? (
          <SnapshotsTable userId={snap.user?.id} bucketsData={bucketsData} />
        ) : (
          <Box height={1000}>
            <Skeleton height={"100%"}></Skeleton>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default withUser()(ReportsPage)
