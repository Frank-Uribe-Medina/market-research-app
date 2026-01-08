import DeleteIcon from "@mui/icons-material/Delete"
import { Chip, CircularProgress, Skeleton } from "@mui/material"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import * as React from "react"
import { toast } from "react-toastify"

import { KeyWordActions } from "../../lib/db/actions/KeyWords"
import { UserAddedSku } from "../../types/keyWordList.model"
import { MARKETPLACES } from "../../types/supported.marketplaces"

interface Props {
  readonly userId: string | undefined
  readonly skus: UserAddedSku[] | null
  readonly isDisabled: boolean
  readonly setIsDisabled: (value: boolean) => void
  readonly refetchKeywords: (value: boolean) => any
  readonly refetching: boolean
}

export default function KeyWordTable({
  userId,
  skus,
  refetchKeywords,
  refetching,
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
    setIsDisabled(false)
    toast.success("Successfully deleted keyword.")
    refetchKeywords(!refetching)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sku</TableCell>
            <TableCell>Marketplace</TableCell>
            <TableCell>Country</TableCell>

            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skus ? (
            skus.map((sku, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {isDisabled ? (
                    <Skeleton width={"100%"} height={"100%"} />
                  ) : (
                    sku.sku
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Chip label={sku.marketplace} />
                </TableCell>
                <TableCell component="th" scope="row">
                  {isDisabled ? (
                    <Skeleton width={"100%"} height={"100%"} />
                  ) : (
                    MARKETPLACES[0].countries.find(
                      (country) => country.code === sku.countryCode
                    )?.name
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Chip
                    label="Delete Keyword"
                    variant="outlined"
                    onDelete={() => void deleteKeyword(sku.id)}
                    disabled={activeKeyword === sku.id && isDisabled}
                    deleteIcon={
                      activeKeyword === sku.id && isDisabled ? (
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
