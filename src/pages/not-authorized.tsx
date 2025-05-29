import { Box, Typography } from "@mui/material"
import { ReactElement } from "react"

import NoHeaderFooterLayout from "../components/layouts/NoHeaderFooterLayout"
import Link from "../components/Link"

export default function NotAuthorizedPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Typography className="text-md" textAlign={"center"}>
        You don't have the necessary authorization to access this page.
      </Typography>
      <Link href="/logout">
        <Typography className="text-xxs">Back to Login</Typography>
      </Link>
    </Box>
  )
}

NotAuthorizedPage.getLayout = function getLayout(page: ReactElement) {
  return <NoHeaderFooterLayout>{page}</NoHeaderFooterLayout>
}
