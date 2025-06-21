import { Box, Button, MenuItem, Select, TextField } from "@mui/material"
import React from "react"
import { toast } from "react-toastify"

import { WatchListActions } from "../../lib/db/actions/WatchList"

interface Props {
  readonly selectedMarketPlace: string
  readonly setMarketPlace: (value: string) => void
  readonly userId: string
  readonly refetch: boolean
  readonly setRefetch: (value: boolean) => void
}

export default function AddToWatchList({
  selectedMarketPlace,
  setMarketPlace,
  userId,
  refetch,
  setRefetch,
}: Props) {
  console.log("UserID", userId)
  const [productId, setProductId] = React.useState("")
  const [zipCode, setZipCode] = React.useState("")

  const handleAddToWatchList = async () => {
    if (productId.length <= 0) {
      toast.error("Please Enter Product ID")
      throw "Please Enter a Product ID"
    } else if (selectedMarketPlace.length <= 0) {
      toast.error("Please Select a Marketplace to add to Watchlist.")
      throw "Please Select Valid Marketplace."
    }
    const data = {
      productId: productId,
      marketplace: selectedMarketPlace,
      zipCode: zipCode,
    }
    const result = WatchListActions.AddNewProduct(userId, data)
    if ((await result).error) {
      console.error((await result).error)
      toast.error("Could not add Products")
    }
    setRefetch(!refetch)
    toast.success((await result).message)
  }

  const handleChange = (newValue: string) => {
    setMarketPlace(newValue)
  }
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      gap={2}
      justifyContent={"space-between"}
    >
      <Select
        onChange={(e) => handleChange(e.target.value)}
        value={selectedMarketPlace}
        fullWidth
      >
        <MenuItem value={"Amazon"}>Amazon</MenuItem>
        <MenuItem value={"Walmart"}>Walmart</MenuItem>
        <MenuItem value={"Target"}>Target</MenuItem>
        <MenuItem value={"Wayfair"}>Wayfair</MenuItem>
      </Select>
      <Box>
        {selectedMarketPlace === "Amazon" ? (
          <Box display={"flex"} gap={1}>
            <TextField
              placeholder="Enter URL"
              fullWidth
              onChange={(e) => setProductId(e.target.value)}
            />
            <TextField
              placeholder="Zipcode"
              fullWidth
              onChange={(e) => setZipCode(e.target.value)}
            />
          </Box>
        ) : null}
        {selectedMarketPlace === "Walmart" ? (
          <Box>
            <TextField
              placeholder="Enter URL"
              onChange={(e) => setProductId(e.target.value)}
              fullWidth
            />
          </Box>
        ) : null}
        {selectedMarketPlace === "Target" ? (
          <Box>
            <TextField
              placeholder="Enter URL"
              fullWidth
              onChange={(e) => setProductId(e.target.value)}
            />
          </Box>
        ) : null}
        {selectedMarketPlace === "Wayfair" ? (
          <Box>
            <TextField
              placeholder="Link of Product"
              fullWidth
              onChange={(e) => setProductId(e.target.value)}
            />
          </Box>
        ) : null}
      </Box>
      <Box>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => void handleAddToWatchList()}
        >
          Add to WatchList
        </Button>
      </Box>
    </Box>
  )
}
