import { Box, FormControlLabel, FormGroup } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"

export default function MarketPlaces() {
  return (
    <Box>
      <FormGroup>
        <Box display={"flex"} flexDirection={"row"}>
          <FormControlLabel control={<Checkbox />} label="Amazon" />
          <FormControlLabel control={<Checkbox />} label="Walmart" />
          <FormControlLabel control={<Checkbox />} label="Ebay" />
          <FormControlLabel control={<Checkbox />} label="Target" />
        </Box>
      </FormGroup>
    </Box>
  )
}
