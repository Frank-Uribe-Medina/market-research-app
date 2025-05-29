import { Box, Typography } from "@mui/material"

export default function Footer() {
  return (
    <Box
      sx={{
        height: 250,
        bgcolor: "primary.main",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography fontWeight="bold" className="text-md" color="text.secondary">
        FOOTER
      </Typography>
    </Box>
  )
}
