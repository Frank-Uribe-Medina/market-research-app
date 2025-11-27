import { Box, FormControlLabel, FormGroup } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"

export default function TrendingCategories() {
  return (
    <Box>
      <FormGroup>
        <Box display={"flex"} flexWrap={"wrap"}>
          {["Noon", "Amazong.eg", "Google", "Tiktok Shop", "Shopify"].map(
            (store) => {
              return (
                <FormControlLabel
                  control={<Checkbox name={store} disabled />}
                  label={store}
                />
              )
            }
          )}
        </Box>
      </FormGroup>
    </Box>
  )
}
