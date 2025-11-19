import DeleteIcon from "@mui/icons-material/Delete"
import { Chip, CircularProgress, Skeleton } from "@mui/material"
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
import { KeywordShapeFirebase } from "../../types/keyWordList.model"

interface Props {
  readonly userId: string | undefined
  readonly keywords: KeywordShapeFirebase[] | null
  readonly isDisabled: boolean
  readonly setIsDisabled: (value: boolean) => void
  readonly triggerRefetch: (value: any) => any
}

export default function KeyWordTable({
  userId,
  keywords,
  triggerRefetch,
  isDisabled,
  setIsDisabled,
}: Props) {
  const [activeKeyword, setActiveKeyword] = React.useState("")
  const deleteKeyword = async (keywordId: string) => {
    setIsDisabled(!isDisabled)
    setActiveKeyword(keywordId)
    const result = await KeyWordActions.DeleteKeyWord(userId ?? "", keywordId)

    if (!result.message) {
      toast.error(result?.message ?? "")
    }
    triggerRefetch([])
    setIsDisabled(false)
    toast.success("Successfully deleted keyword.")
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Keyword</TableCell>
            <TableCell>Marketplaces</TableCell>
            <TableCell>Results Per Word</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keywords ? (
            keywords.map((keyword, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {isDisabled ? <Skeleton /> : keyword.keyword}
                </TableCell>
                <TableCell component="th" scope="row">
                  {keyword.marketplaces ? (
                    <Box display={"flex"} flexDirection={"row"} gap={1}>
                      {keyword.marketplaces.map((marketplace) => (
                        <Chip label={marketplace} />
                      ))}
                    </Box>
                  ) : (
                    "None"
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  {isDisabled ? <Skeleton /> : (keyword.limitInput ?? 2)}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Chip
                    label="Delete Keyword"
                    variant="outlined"
                    onDelete={() => void deleteKeyword(keyword.id)}
                    disabled={activeKeyword === keyword.id && isDisabled}
                    deleteIcon={
                      activeKeyword === keyword.id && isDisabled ? (
                        <CircularProgress size={10} />
                      ) : (
                        <DeleteIcon />
                      )
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
