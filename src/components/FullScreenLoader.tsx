import { Box, CircularProgress } from "@mui/material"

export default function FullScreenLoader() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999_999,
        bgcolor: "background",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  )
}
