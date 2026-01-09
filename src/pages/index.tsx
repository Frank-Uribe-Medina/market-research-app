import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SaveAsIcon from "@mui/icons-material/SaveAs"
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
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"
import { useSnapshot } from "valtio"

import AddKeywordForm from "../components/forms/AddKeyword"
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
  whenAuthed: AuthAction.RENDER,
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
    snap.user?.id ?? "",
    10
  )

  const [isDisabled, setIsDisabled] = React.useState(false)

  useEffect(() => {
    const getFreshList = async () => {
      await refetchKeywords()
    }
    getFreshList()
  }, [refetching, refetchKeywords])
  useEffect(() => {
    console.log(snap.user?.subplan)
  }, [snap])

  const runList = useDebouncedCallback(async () => {
    try {
      const response = await axios.post<AxiosScrapeStartResponse>(
        `/api/scrape/start`,
        { userId: snap.user?.id }
      )
      if (response.data.error) {
        throw response.data.message
      }
      toast.success("Fetching new Data, Please Check the Analysis Tab")
    } catch (err: any) {
      toast.error(err)
      console.error(err)
    } finally {
      setIsDisabled(false)
    }
  }, 1000)

  if (!snap.user) {
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
  if (!snap.user || !snap.isUserLoaded) {
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
    <>
      <Seo title="Home" />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
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
          <Grid size={12}>
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
          {/* Keyword Table */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={2}
              sx={{ p: 3, display: "flex", flexDirection: "column" }}
            >
              <Grid container mb={2}>
                <Grid size={{ md: 6 }}>
                  {" "}
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
                </Grid>
                <Grid
                  size={{ md: 6 }}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  {" "}
                  <Tooltip title="Free accounts cannot run scraping jobs in intervals. Please Upgrade if you want to run these jobs on a schedule. ">
                    <InfoOutlineIcon fontSize={"small"} />
                  </Tooltip>
                  <Button
                    variant="outlined"
                    startIcon={
                      subPlan === "free" ? <RestartAltIcon /> : <SaveAsIcon />
                    }
                    disabled={isDisabled}
                    onClick={() => void runList()}
                    sx={{ height: "100%" }}
                  >
                    {subPlan === "free" ? "Run Now" : "Save List"}
                  </Button>
                </Grid>
              </Grid>
              <KeyWordTable
                userId={snap.user.id}
                skus={AllKeywords?.pages[0].content ?? null}
                refetchKeywords={setRefetching}
                refetching={refetching}
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default withUser<SSRProps>()(Dashboard)
