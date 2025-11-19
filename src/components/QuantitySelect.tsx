import Box from "@mui/material/Box"
import * as React from "react"

import MarketPlaces from "./Marketplaces"

export default function TrendingCategories() {
  const [selectedMarketPlaces, setSelectedMarketPlaces] = React.useState<
    string[]
  >([])

  return (
    <Box sx={{ minWidth: 120 }}>
      <MarketPlaces
        selectedStores={selectedMarketPlaces}
        setSelectedStores={setSelectedMarketPlaces}
      />
    </Box>
  )
}
