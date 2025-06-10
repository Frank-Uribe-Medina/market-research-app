import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material"
import axios from "axios"
import { AuthAction, withUser, withUserTokenSSR } from "next-firebase-auth"
import React, { useEffect } from "react"
import { toast } from "react-toastify"
import { useSnapshot } from "valtio"

import CreateNewList from "../components/CreateNewList"
import MarketPlaces from "../components/Marketplaces"
import QuantitySelect from "../components/QuantitySelect"
import Seo from "../components/Seo"
import KeyWordTable from "../components/tables/KeyWordTable"
import state from "../contexts/ValtioStore"
import { KeyWordActions } from "../lib/db/actions/KeyWords"
import { KeyWordObjectModal } from "../types/keyWordList.model"

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
  const theme = useTheme()

  const [selectedKeyWordListID, setKeyWordListId] = React.useState("")
  const [keyWord, setNewKeyWord] = React.useState("")
  const [resultLimit, setResultLimit] = React.useState("")
  const [refetch, setRefetch] = React.useState(false)
  const [isDisabled, setIsDisabled] = React.useState(false)

  const [selectedMarketPlaces, setSelectedMarketPlaces] = React.useState<
    string[]
  >([])
  const [listOfKeyWords, setKeyWords] =
    React.useState<KeyWordObjectModal | null>(null)

  useEffect(() => {
    console.log(snap.user)
  }, [snap.user])
  useEffect(() => {
    if (!selectedKeyWordListID || !snap.user?.id) return
    const fetchData = async () => {
      const keyWords = await KeyWordActions.GetList(
        snap.user?.id ? snap.user.id : "",
        selectedKeyWordListID
      )
      setKeyWords(keyWords.content ?? null)
      setRefetch(true)
    }
    fetchData()
  }, [selectedKeyWordListID, snap.user?.id, refetch])

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
  const handleScrape = async () => {
    setIsDisabled(!isDisabled)

    if (listOfKeyWords && listOfKeyWords.keyWords.length <= 0) {
      toast.error("Please add a keyword before running list.")
      return
    }
    const data = {
      userId: snap.user?.id,
      listName: listOfKeyWords?.name,
      listId: listOfKeyWords?.id,
    }
    await axios
      .post("/api/scrape/", data)
      .then(() => {
        toast.success("Starting.")
      })
      .catch((response) => {
        toast.error(response)
      })
    setIsDisabled(false)
  }
  const handleAddingKeyWord = async () => {
    if (Number(resultLimit) <= 0 || undefined) {
      toast.error("Set Limit for keyword")
      return
    }
    if (selectedMarketPlaces.length <= 0) {
      toast.error("Add Marketplace Search.")
      return
    }
    const data = {
      keyword: keyWord,
      marketplaces: selectedMarketPlaces,
      quantity: resultLimit,
    }
    KeyWordActions.UpdateKeyWordListWithNewKeyWords(
      snap.user?.id ? snap.user.id : "",
      selectedKeyWordListID,
      data
    )

    // Re-fetch list
    const updatedList = await KeyWordActions.GetList(
      snap.user?.id ? snap.user?.id : "",
      selectedKeyWordListID
    )
    setKeyWords(updatedList.content ? updatedList.content : null)
    setNewKeyWord("")
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
            {/* Add Keyword Section */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  gap={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography variant="h6" gutterBottom>
                    Create / Select Keyword List
                  </Typography>
                  <Box>
                    <Tooltip title="Create a List of related Keywords, that will search across the selected marketplaces and be ready to download in the reports page.">
                      <InfoOutlineIcon fontSize="small" />
                    </Tooltip>
                  </Box>
                </Box>

                <CreateNewList
                  userId={snap.user.id}
                  setKeyWordListId={setKeyWordListId}
                  selectedListId={selectedKeyWordListID}
                />
              </Paper>
            </Grid>

            {/* Marketplaces & Quantity Select */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  gap={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography variant="h6" gutterBottom>
                    Select Marketplaces
                  </Typography>
                  <Box>
                    <Tooltip title="Select the marketplace you want to search per keyword.">
                      <InfoOutlineIcon fontSize={"small"} />
                    </Tooltip>
                  </Box>
                </Box>

                <MarketPlaces
                  selectedStores={selectedMarketPlaces}
                  setSelectedStores={setSelectedMarketPlaces}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Typography variant="h6" gutterBottom>
                    Result Per Keyword
                  </Typography>
                  <Box>
                    <Tooltip title="This Controls how many results you want per keyword on the list. Keep in mind the more results per keyword will significantly increase the time to grab data. ">
                      <InfoOutlineIcon fontSize={"small"} />
                    </Tooltip>
                  </Box>
                </Box>

                <QuantitySelect
                  setResultLimit={setResultLimit}
                  result={resultLimit}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                {/* Add New Keyword */}
                {selectedKeyWordListID ? (
                  <Box display={"flex"} flexDirection={"column"} gap={1}>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"left"}
                      alignItems={"center"}
                      gap={1}
                    >
                      <Typography variant="h6" gutterBottom>
                        Add Keyword to list
                      </Typography>
                      <Box>
                        <ArrowForwardIosIcon
                          fontSize="small"
                          sx={{ color: theme.palette.primary.main }}
                        />{" "}
                      </Box>
                      <Typography
                        variant="h6"
                        color={theme.palette.primary.main}
                        gutterBottom
                      >
                        {listOfKeyWords?.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textDisabled">
                      eg: 32 oz water bottle for school
                    </Typography>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                      gap={4}
                    >
                      <TextField
                        label="New Keyword"
                        variant="outlined"
                        fullWidth
                        value={keyWord}
                        onChange={(e) => setNewKeyWord(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => void handleAddingKeyWord()}
                      >
                        Add to List
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography color={theme.palette.error.main}>
                      Select a List.
                    </Typography>
                    <Skeleton height={50} />
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Keyword Table */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  {" "}
                  <Typography variant="h6" gutterBottom>
                    Keywords in{" "}
                    {listOfKeyWords ? (
                      <span style={{ color: theme.palette.primary.main }}>
                        {listOfKeyWords?.name}{" "}
                      </span>
                    ) : (
                      <span style={{ color: theme.palette.error.main }}>
                        Select a List{" "}
                      </span>
                    )}
                    List
                  </Typography>
                  <Box sx={{ textAlign: "right" }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => void handleScrape()}
                      disabled={isDisabled}
                    >
                      <Box display={"flex"} flexDirection={"row"} gap={1}>
                        {isDisabled ? (
                          <Box>
                            <CircularProgress size={16} />
                          </Box>
                        ) : (
                          <Box>
                            <PlayCircleIcon color="secondary" />
                          </Box>
                        )}
                        Run List
                      </Box>
                    </Button>
                  </Box>
                </Box>

                <KeyWordTable
                  keyWords={listOfKeyWords?.keyWords ?? null}
                  userId={snap.user.id}
                  listId={listOfKeyWords?.id ?? ""}
                  refetch={setRefetch}
                />
              </Paper>
            </Grid>

            {/* Save Search Button */}
            <Grid size={{ xs: 12 }}></Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default withUser()(HomePage)
