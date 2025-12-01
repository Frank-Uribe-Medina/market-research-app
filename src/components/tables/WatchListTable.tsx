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
  Typography,
  useTheme,
} from "@mui/material"
import * as React from "react"
import { toast } from "react-toastify"

import { WatchListActions } from "../../lib/db/actions/WatchList"
import { PriceHistoryShape, WatchListProduct } from "../../types/watchlist.mode"
import DeleteModal from "../modals/DeleteModal"
import LineChartModal from "../modals/LineChartModal"

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
  const [selectedProductHistory, setSelectedProductHistory] = React.useState<
    PriceHistoryShape[]
  >([])
  const [selectedForDelete, setSelectedForDelete] =
    React.useState<WatchListProduct>()
  const [open, setOpen] = React.useState(false)
  const handleOpen = (productHistory: PriceHistoryShape[]) => {
    setOpen(true)
    setSelectedProductHistory(productHistory)
  }
  const handleClose = () => setOpen(false)
  const handleDeleteClose = () => setDeleteOpen(false)

  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const handleDeleteOpen = (product: WatchListProduct) => {
    setDeleteOpen(true)
    setSelectedForDelete(product)
  }

  const handleDelete = async (id: string): Promise<void> => {
    handleDeleteClose()
    const result = await WatchListActions.DeleteProduct(userId, id)
    if (result.error) {
      toast.error(result.message)
    }
    setRefetch(!refetch)
    toast.success(result.message)
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
              Product
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              MarketPlace
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Product Link
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
            ? data.map((product) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={
                          product.productImage
                            ? product.productImage[0]
                            : "/assets/images/logo.png"
                        }
                        style={{ objectFit: "contain", borderRadius: 10 }}
                        height={50}
                        alt=""
                      />
                    </TableCell>

                    <TableCell>{product.marketPlace}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Box
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <a href={product.productId}> {product.productId}</a>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography>{product.productTitle}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={product.latestPrice}
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Box display={"flex"} flexDirection={"row"}>
                        <IconButton
                          onClick={() => void handleOpen(product.priceHistory)}
                        >
                          <RemoveRedEyeIcon />
                        </IconButton>
                        <LineChartModal
                          data={selectedProductHistory}
                          handleClose={handleClose}
                          open={open}
                        />
                        <IconButton onClick={() => handleDeleteOpen(product)}>
                          <DeleteIcon />
                        </IconButton>
                        <DeleteModal
                          handleClose={handleDeleteClose}
                          open={deleteOpen}
                          data={selectedForDelete ? selectedForDelete : null}
                          handleDelete={handleDelete}
                        />
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
