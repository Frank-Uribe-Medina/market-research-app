import DeleteIcon from "@mui/icons-material/Delete"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material"
import * as React from "react"
import { toast } from "react-toastify"

import { WatchListActions } from "../../lib/db/actions/WatchList"
import { WatchListProduct } from "../../types/watchlist.mode"

interface Props {
  readonly userId: string
  readonly data: WatchListProduct[]
  readonly refetch: boolean
  readonly setRefetch: (value: boolean) => void
}

export default function WatchListTable({
  data,
  userId,
  refetch,
  setRefetch,
}: Props) {
  const theme = useTheme()

  const handleDelete = async (id: string) => {
    console.log("Is this getting pased?", id)
    const result = await WatchListActions.DeleteProduct(userId, id)
    console.log(result)
    if (result.error) {
      return toast.error(result.message)
    }
    setRefetch(!refetch)
    return toast.success(result.message)
  }
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="snapshots table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              MarketPlace
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Product ID
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Product Title
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Latest Price
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            ? data.map((product, index) => {
                console.log("Item:", index, product)
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.marketplace}</TableCell>
                    <TableCell>{product.productId}</TableCell>

                    <TableCell>{product.productTitle}</TableCell>

                    <TableCell>
                      <Chip
                        label={product.latestPrice}
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Box>
                        <IconButton>
                          <RemoveRedEyeIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => void handleDelete(product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
