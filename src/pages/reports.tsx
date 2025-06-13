import { Box, CircularProgress, Container, Typography } from "@mui/material"
import axios from "axios"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import React, { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useSnapshot } from "valtio"

import SnapshotsTable from "../components/tables/SnapShotsTable"
import state from "../contexts/ValtioStore"
import { SnapShotActions } from "../lib/db/actions/Snapshots"
import { BucketsShape } from "../types/snapshots.model"
import { formatFirebaseDate } from "../utils"

interface ReportsPageProps {
  readonly initial_data: BucketsShape[]
}

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  console.log(ctx.user?.claims)
  const initialBucketsData = await SnapShotActions.GetAllSnapShotBuckets(
    ctx.user?.id ?? "",
    10
  )
  const rawBuckets = initialBucketsData.content as BucketsShape[]
  //This is for formatting as you will get a 500 error if it has a firebase timestamp
  const formatted_bucket: BucketsShape[] = []
  rawBuckets.forEach((item: BucketsShape) => {
    const newBucket: BucketsShape = {
      id: item.id ?? "",
      name: item.name ?? "",
      createdAt: formatFirebaseDate(item?.createdAt),
      snapshots: item?.snapshots,
      ready: item?.ready,
    }
    formatted_bucket.push(newBucket)
  })

  return {
    props: {
      initial_date: formatted_bucket,
    },
  }
})

function ReportsPage({ initial_data }: ReportsPageProps) {
  const snap = useSnapshot(state)
  const [bucketsData, setBucketsData] = useState<BucketsShape[]>(initial_data)

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
    const buckets = await SnapShotActions.GetAllSnapShotBuckets(
      snap.user?.id ? snap.user.id : "",
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
      setBucketsData(formated_buckets)
    })
  }, [snap.user?.id, bucketsData])
  useEffect(() => {
    const interval = setInterval(() => {
      getProgress()
    }, 5000)
    //This part is cleanup
    return () => clearInterval(interval)
  }, [getProgress])
  return (
    <Container sx={{ height: "86vh" }}>
      <Box sx={{ px: 3, py: 4 }}>
        {bucketsData && snap.user?.id ? (
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Reports Table
            </Typography>
            <SnapshotsTable userId={snap.user?.id} bucketsData={bucketsData} />
          </Box>
        ) : (
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CircularProgress size={50} />
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default withUser<ReportsPageProps>()(ReportsPage)
