import { Box, FormControlLabel, FormGroup } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"

interface Props {
  readonly setSelectedStores: (value: string[]) => void
  readonly selectedStores: string[]
}
export default function MarketPlaces({
  setSelectedStores,
  selectedStores,
}: Props) {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const store = event.target.name
    if (event.target.checked) {
      setSelectedStores([...selectedStores, store])
    } else {
      setSelectedStores(selectedStores.filter((s) => s !== store))
    }
  }

  return (
    <Box>
      <FormGroup>
        <Box display={"flex"} flexDirection={"row"}>
          {["Amazon", "Walmart", "Target", "WayFair"].map((store) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    name={store}
                    checked={selectedStores.includes(store)}
                    onChange={handleCheckboxChange}
                  />
                }
                label={store}
              />
            )
          })}
        </Box>
      </FormGroup>
    </Box>
  )
}
