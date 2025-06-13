import { Box, Container, Paper, Skeleton, Typography } from "@mui/material"
import { AuthAction, withUserTokenSSR } from "next-firebase-auth"
import React, { useEffect } from "react"
import { useSnapshot } from "valtio"

import WatchListTable from "../components/tables/WatchListTable"
import AddToWatchList from "../components/watchlist/AddtoWatchList"
import state from "../contexts/ValtioStore"
import { WatchListActions } from "../lib/db/actions/WatchList"
import { WatchListProduct } from "../types/watchlist.mode"
import { formatFirebaseDate } from "../utils"

interface WatchListPageProps {
  readonly watchlistData: WatchListProduct[]
}

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  const watchlist = await WatchListActions.GetAllProductsFromWatchList(
    ctx.user?.id ?? "",
    10
  )
  const temp: WatchListProduct[] = watchlist.content
  const formated_watchlist_data: WatchListProduct[] = []

  temp.forEach((item) => {
    const temp_item: WatchListProduct = {
      ...item,
      createdAt: formatFirebaseDate(item.createdAt),
    }
    formated_watchlist_data.push(temp_item)
  })
  console.log(
    "Seeing whats in the formatedd_watchlist)data",
    formated_watchlist_data
  )

  return {
    props: {
      watchlistData: formated_watchlist_data,
    },
  }
})

export default function Watchlist({ watchlistData }: WatchListPageProps) {
  const snap = useSnapshot(state)

  const [selectedMarketPlace, setMarketPlace] = React.useState("")
  const [refetch, setRefetch] = React.useState(false)
  const [newWatchlistData, setNewWatchlistData] =
    React.useState<WatchListProduct[]>(watchlistData)

  useEffect(() => {
    const fetchData = async () => {
      if (refetch) {
        const watchlist = await WatchListActions.GetAllProductsFromWatchList(
          snap?.user?.id ?? "",
          10
        )
        const temp: WatchListProduct[] = watchlist.content.map(
          (item: WatchListProduct) => ({
            ...item,
            createdAt: formatFirebaseDate(item.createdAt),
          })
        )
        setNewWatchlistData(temp)
        setRefetch(!refetch)
      }
    }
    fetchData()
  }, [refetch, snap.user?.id])

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
        <Typography variant="h6">Products Currenlty Watching</Typography>
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
            <Typography width={"100%"}>Add Product to Watchlist.</Typography>
            <AddToWatchList
              selectedMarketPlace={selectedMarketPlace}
              setMarketPlace={setMarketPlace}
              userId={snap.user?.id ?? ""}
              refetch={refetch}
              setRefetch={setRefetch}
            />
          </Box>
        </Paper>
        {/* This is the Table */}
        <WatchListTable
          userId={snap.user?.id}
          data={newWatchlistData}
          setRefetch={setRefetch}
          refetch={refetch}
        />
      </Box>
    </Container>
  )
}
