import { PlayArrow } from "@mui/icons-material"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material"
import axios from "axios"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import React, { useEffect } from "react"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"
import { useSnapshot } from "valtio"

import AddKeywordForm from "../components/forms/AddKeyword"
import TrendingCategories from "../components/QuantitySelect"
import Seo from "../components/Seo"
import KeyWordTable from "../components/tables/KeyWordTable"
import state from "../contexts/ValtioStore"
import { useGetAllKeyWordLists } from "../lib/db/hooks/KeyWords"
import { AxiosScrapeStartResponse } from "../types/axios.model"
import { KeywordShapeFirebase } from "../types/keyWordList.model"

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
  const [keywords, addKeyword] = React.useState<KeywordShapeFirebase[]>([])
  const { data: AllKeywords, refetch: refetchKeywords } = useGetAllKeyWordLists(
    snap.user?.id,
    10
  )

  const [isDisabled, setIsDisabled] = React.useState(false)

  useEffect(() => {
    console.log(snap.user)
  }, [snap.user])

  useEffect(() => {
    const timerId = setTimeout(() => {
      refetchKeywords()
    }, 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [keywords, refetchKeywords])
  const runList = useDebouncedCallback(async () => {
    console.log("CLICKED THE BUTTON TO RUN LIST")
    try {
      const response = await axios.post<AxiosScrapeStartResponse>(
        `/api/scrape/start`,
        { userId: snap.user?.id }
      )
      if (response.data.error) {
        throw Error(response.data.message)
      }
    } catch (err: any) {
      toast.error(err)
      console.error(err)
    } finally {
      setIsDisabled(false)
    }
  }, 500)

  if (!snap.user) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    )
  }
  if (!snap.user || !snap.isUserLoaded) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    )
  }
  if (!snap.isUserLoaded) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Seo title="Home" />
      <Box sx={{ minHeight: "86vh", py: 5, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Market Recon
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Cross-Market Research Dashboard
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {" "}
            <Grid size={6}>
              <Paper elevation={2} sx={{ p: 4 }}>
                <AddKeywordForm
                  addKeyword={addKeyword}
                  isDisabled={isDisabled}
                  setIsDisabled={setIsDisabled}
                />
              </Paper>
            </Grid>
            {/* Marketplaces & Quantity Select */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Tooltip title="See the Trending categories for each available marketplace. ">
                    <InfoOutlineIcon fontSize={"small"} />
                  </Tooltip>
                  Trending Categories
                </Typography>

                <TrendingCategories />
              </Paper>
            </Grid>
            {/* Keyword Table */}
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={2}
                sx={{ p: 3, display: "flex", flexDirection: "column" }}
              >
                <Box display={"flex"} justifyContent={"space-between"} mb={2}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    display={"flex"}
                    gap={1}
                    alignItems={"center"}
                  >
                    <Tooltip title="See the Trending categories for each available marketplace. ">
                      <InfoOutlineIcon fontSize={"small"} />
                    </Tooltip>
                    Your Keywords
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={
                      isDisabled ? (
                        <CircularProgress size={10} />
                      ) : (
                        <PlayArrow />
                      )
                    }
                    disabled={isDisabled}
                    onClick={() => void runList()}
                  >
                    Run List
                  </Button>
                </Box>
                <KeyWordTable
                  userId={snap.user.id}
                  keywords={AllKeywords?.pages[0].content ?? null}
                  triggerRefetch={addKeyword}
                  isDisabled={isDisabled}
                  setIsDisabled={setIsDisabled}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default withUser()(HomePage)
