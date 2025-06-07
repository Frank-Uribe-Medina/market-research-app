import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import * as React from "react"

interface Props {
  readonly setResultLimit: (value: string) => void
  readonly result: string
}

export default function QuantitySelect({ setResultLimit, result }: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    setResultLimit(event.target.value as string)
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Select Result per Keyword</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={result}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
