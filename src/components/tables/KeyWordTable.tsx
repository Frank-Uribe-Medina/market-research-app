import { Chip, Skeleton } from "@mui/material"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { Box } from "@mui/system"
import * as React from "react"
import { toast } from "react-toastify"

import { KeyWordActions } from "../../lib/db/actions/KeyWords"
import { KeyWordShape } from "../../types/keyWordList.model"

interface Props {
  readonly keyWords: KeyWordShape[] | null
  readonly userId: string
  readonly listId: string
  readonly refetch: (value: boolean) => void
}

export default function KeyWordTable({
  keyWords,
  userId,
  listId,
  refetch,
}: Props) {
  const handleDeleteKeywordFromList = async (keyWord: string) => {
    const result = await KeyWordActions.DeleteKeyWord(userId, listId, keyWord)

    if (!result.message) {
      toast.error(result?.message ?? "")
    }
    refetch(false)
    toast.success("Successfully deleted keyword.")
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>KeyWord</TableCell>
            <TableCell>Marketplaces</TableCell>
            <TableCell>Result Per Word</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keyWords && keyWords.length > 0 ? (
            keyWords.map((keyWord, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {keyWord.keyword}
                </TableCell>
                <TableCell component="th" scope="row">
                  {keyWord.marketplaces ? (
                    <Box display={"flex"} flexDirection={"row"} gap={1}>
                      {keyWord.marketplaces.map((marketplace) => (
                        <Chip label={marketplace} />
                      ))}
                    </Box>
                  ) : (
                    "None"
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  {keyWord.quantity ? keyWord.quantity : ""}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Chip
                    label="Delete Keyword"
                    variant="outlined"
                    onDelete={() =>
                      void handleDeleteKeywordFromList(keyWord.keyword)
                    }
                  />{" "}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {" "}
              <TableCell>
                {" "}
                <Skeleton></Skeleton>
              </TableCell>
              <TableCell>
                {" "}
                <Skeleton></Skeleton>
              </TableCell>
              <TableCell>
                {" "}
                <Skeleton></Skeleton>
              </TableCell>
              <TableCell>
                {" "}
                <Skeleton></Skeleton>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
