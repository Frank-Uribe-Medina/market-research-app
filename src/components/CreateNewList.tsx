import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { toast } from "react-toastify"

import { KeyWordActions } from "../lib/db/actions/KeyWords"
import { useGetAllKeyWordLists } from "../lib/db/hooks/KeyWords"

interface Props {
  readonly userId: string
  readonly setKeyWordList: (value: string) => void
  readonly selectedListId: string
}

export default function CreateNewList({
  userId,
  setKeyWordList,
  selectedListId,
}: Props) {
  const [keywordListName, setKeyWordListName] = React.useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const [keyWordListSelected, setKeyWordListSelected] = useState(false)

  const handleChange = (event: SelectChangeEvent) => {
    setKeyWordListSelected(!keyWordListSelected)
    setKeyWordList(event.target.value as string)
  }

  const handleDelete = async () => {
    if (!keyWordListSelected) {
      toast.error("No list to delete.")
      return
    }
    const result = await KeyWordActions.DeleteList(userId, selectedListId)
    if (!result.error) {
      toast.success("Successfully Deleted Keyword List.")
      setKeyWordListSelected(false)
    }
    refetch()
  }
  const queryClient = useQueryClient()
  const result = useGetAllKeyWordLists(userId, 10).data?.pages
  const { refetch } = useGetAllKeyWordLists(userId, 10)

  const handleCreateList = async () => {
    if (keywordListName.length <= 0) {
      toast.error("Please enter a name for list.")
      return
    }
    setIsDisabled(!isDisabled)
    await KeyWordActions.CreateKeyWordList(userId, keywordListName)
    queryClient.invalidateQueries({ queryKey: ["getListOfKeyWords", userId] })
    toast.success("Successfully Added List to dropdown.")
    setKeyWordListName("")

    refetch()
    setTimeout(function () {
      setIsDisabled(false)
    }, 500)
  }

  return (
    <Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"center"}
        gap={2}
        p={2}
      >
        <TextField
          placeholder="New List Name."
          value={keywordListName}
          onChange={(e) => setKeyWordListName(e.target.value)}
        ></TextField>
        <Button variant="contained" onClick={() => void handleCreateList()}>
          <Box display={"flex"} flexDirection={"row"} gap={1}>
            {isDisabled ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              <></>
            )}
            <Typography>Create new List of Keywords</Typography>
            <Tooltip title="Create Keyword lists to save for later." arrow>
              <InfoOutlineIcon />
            </Tooltip>
          </Box>
        </Button>
      </Box>
      <Box
        sx={{ minWidth: 120 }}
        display={"flex"}
        flexDirection={"column"}
        gap={1}
      >
        <FormControl fullWidth>
          <InputLabel>Select List</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            onChange={handleChange}
          >
            {result ? (
              result.map((item) => {
                return (
                  item.content.map((KeyWordList) => (
                    <MenuItem key={KeyWordList.id} value={KeyWordList.id}>
                      {KeyWordList.name}
                    </MenuItem>
                  )) || []
                )
              })
            ) : (
              <Skeleton></Skeleton>
            )}
          </Select>
        </FormControl>
        <Box>
          <Chip label="Delete List" onDelete={() => void handleDelete()} />
        </Box>
      </Box>{" "}
    </Box>
  )
}
