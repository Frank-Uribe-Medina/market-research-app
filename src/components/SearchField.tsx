import SearchIcon from "@mui/icons-material/Search"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { SyntheticEvent } from "react"
import { useDebouncedCallback } from "use-debounce"

type Props = {
  readonly handleValueChange: (s: string) => void
  readonly placeholder?: string
}

export default function SearchField({
  handleValueChange,
  placeholder = "Search",
}: Props) {
  const handleFormSubmission = useDebouncedCallback((e: SyntheticEvent) => {
    const target = e.target as typeof e.target & {
      search: { value: string }
    }

    handleValueChange(target.search.value)
  }, 500)

  const onDebounced = (e: SyntheticEvent) => {
    e.preventDefault()
    handleFormSubmission(e)
  }

  return (
    <form onSubmit={onDebounced}>
      <TextField
        size="small"
        fullWidth
        name="search"
        // label="Search"
        placeholder={placeholder}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton type="submit">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </form>
  )
}
