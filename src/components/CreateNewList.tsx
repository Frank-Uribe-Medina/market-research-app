import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { toast } from "react-toastify"

import { KeyWordActions } from "../lib/db/actions/KeyWords"
import { useGetAllKeyWordLists } from "../lib/db/hooks/KeyWords"
import { KeyWordObjectModal } from "../types/keyWordList.model"

interface Props {
  readonly userId: string
  readonly setKeyWordListId: (value: string) => void
  readonly selectedListId: string
}

export default function CreateNewList({
  userId,
  setKeyWordListId,
  selectedListId,
}: Props) {
  const [keywordListName, setKeyWordListName] = React.useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const [keyWordListSelected, setKeyWordListSelected] = useState(false)

  const handleDelete = async () => {
    if (!keyWordListSelected) {
      toast.error("No list to delete.")
      return
    }
    const result = await KeyWordActions.DeleteList(userId, selectedListId)
    if (!result.error) {
      toast.success("Successfully Deleted Keyword List.")
      setKeyWordListSelected(false)
      setKeyWordListName("")
    }
    refetch()
  }
  const queryClient = useQueryClient()
  const result = useGetAllKeyWordLists(userId, 10).data?.pages
  const { refetch } = useGetAllKeyWordLists(userId, 10)
  const options: KeyWordObjectModal[] = []
  result?.map((item) => {
    item.content.map((list) => {
      options.push(list)
    })
  })
  const handleChange = (
    event: React.SyntheticEvent,
    value: string | KeyWordObjectModal | null
  ) => {
    if (typeof value === "string") {
      console.log("In the Handle Change", value)
      setKeyWordListSelected(!keyWordListSelected)
      setKeyWordListId("")
      setKeyWordListName("")
    } else if (value) {
      setKeyWordListSelected(true)
      setKeyWordListName(value.name ?? "")
      setKeyWordListId(value?.id ?? "")
    } else {
      // Value is null (cleared)
      setKeyWordListSelected(false)
      setKeyWordListId("")
      setKeyWordListName("")
    }
  }

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
      <FormControl fullWidth>
        <Box display={"flex"} justifyContent={"center"} gap={2}>
          <Autocomplete
            freeSolo
            options={options ? options : []}
            getOptionLabel={(options) =>
              typeof options === "string" ? options : options.name
            }
            onChange={handleChange}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <Box display={"flex"} flexDirection={"column"} gap={1}>
                <TextField
                  {...params}
                  label="Create/Select a List"
                  value={keywordListName}
                  onChange={(e) => setKeyWordListName(e.target.value)}
                />
                <Box>
                  <Chip
                    label="Delete List"
                    onDelete={() => void handleDelete()}
                    size="medium"
                  />
                </Box>
              </Box>
            )}
          />
          <Box>
            <Button
              variant="contained"
              onClick={() => void handleCreateList()}
              sx={{ height: 55 }}
            >
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
        </Box>
      </FormControl>
    </Box>
  )
}
