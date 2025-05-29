import SearchIcon from "@mui/icons-material/Search"
import { Box, Button, TextField } from "@mui/material"

export default function AddKeyWord() {
  return (
    <Box>
      <SearchIcon />
      <TextField></TextField>
      <Button variant="contained">Add Key Word</Button>
    </Box>
  )
}
