import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SaveAsIcon from "@mui/icons-material/SaveAs"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@mui/material"
import axios from "axios"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"
import { useSnapshot } from "valtio"

import AddKeywordForm from "../components/forms/AddKeyword"
import TrendingCategories from "../components/QuantitySelect"
import Seo from "../components/Seo"
import KeyWordTable from "../components/tables/KeyWordTable"
import state from "../contexts/ValtioStore"
import { useGetAllKeyWords } from "../lib/db/hooks/KeyWords"
import { AxiosScrapeStartResponse } from "../types/axios.model"
import { User } from "../types/user.model"

interface SSRProps {
  readonly userData: User
}
export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  return {
    props: { userData: JSON.stringify(ctx.user) },
  }
})

function Dashboard({ userData }: SSRProps) {
  const snap = useSnapshot(state)
  const subPlan = userData.subplan ?? "free"
  const [refetching, setRefetching] = useState(false)
  const { data: AllKeywords, refetch: refetchKeywords } = useGetAllKeyWords(
    snap.user?.id,
    10
  )

  const [isDisabled, setIsDisabled] = React.useState(false)

  useEffect(() => {
    const getFreshList = async () => {
      await refetchKeywords()
    }
    getFreshList()
  }, [refetching, refetchKeywords])

  const runList = useDebouncedCallback(async () => {
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
                  subPlan={subPlan}
                  count={AllKeywords?.pages[0].count}
                  refetchKeywords={setRefetching}
                  refetching={refetching}
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
                  color="textDisabled "
                >
                  <Tooltip title="WORK IN PROGRESS. See the Trending categories for each available marketplace. ">
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
                    <Tooltip title="These are the terms that will be scraped ">
                      <InfoOutlineIcon fontSize={"small"} />
                    </Tooltip>
                    Your Search Terms
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <Tooltip title="Free accounts cannot run scraping jobs in intervals. Please Upgrade if you want to run these jobs on a schedule. ">
                      <InfoOutlineIcon fontSize={"small"} />
                    </Tooltip>
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel id="check-every">Run on Every...</InputLabel>
                      <Select
                        labelId="check-every"
                        id="check-every-select"
                        aria-placeholder="tst"
                      >
                        <MenuItem value={60} disabled={subPlan === "free"}>
                          Hour
                        </MenuItem>
                        <MenuItem value={360} disabled={subPlan === "free"}>
                          6 Hours
                        </MenuItem>
                        <MenuItem value={1440} disabled={subPlan === "free"}>
                          24 Hours
                        </MenuItem>
                        <MenuItem value={2160} disabled={subPlan === "free"}>
                          36 Hours
                        </MenuItem>
                        <MenuItem value={4320} disabled={subPlan === "free"}>
                          72 Hours
                        </MenuItem>
                        <MenuItem value={43200} disabled={subPlan === "free"}>
                          Month
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      startIcon={
                        subPlan === "free" ? <RestartAltIcon /> : <SaveAsIcon />
                      }
                      disabled={isDisabled}
                      onClick={() => void runList()}
                      sx={{ minWidth: 200, height: "100%" }}
                    >
                      {subPlan === "free" ? "Run Now" : "Save List"}
                    </Button>
                  </Box>
                </Box>
                <KeyWordTable
                  userId={snap.user.id}
                  keywords={AllKeywords?.pages[0].content ?? null}
                  refetchKeywords={setRefetching}
                  refetching={refetching}
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

export default withUser<SSRProps>()(Dashboard)
