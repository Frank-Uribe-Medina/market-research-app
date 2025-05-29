import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import * as React from "react"

export default function QuantitySelect() {
  const [resultLimit, setResultLimit] = React.useState("")

  const handleChange = (event: SelectChangeEvent) => {
    setResultLimit(event.target.value as string)
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Limit</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={resultLimit}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>5</MenuItem>
          <MenuItem value={20}>10</MenuItem>
          <MenuItem value={30}>20</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
