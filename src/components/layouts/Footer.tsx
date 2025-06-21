import { Box, Grid, Typography } from "@mui/material"

export default function Footer() {
  return (
    // <Box
    //   sx={{
    //     height: 250,
    //     bgcolor: "primary.main",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    <Grid
      container
      sx={{
        height: 250,
        bgcolor: "primary.main",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Grid size={{ md: 4, xs: 12 }}>
        {" "}
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <img
            src="/assets/images/logo.png"
            alt=""
            style={{ objectFit: "contain", height: 75 }}
          />
          <Typography variant="h4">Brother Solutions</Typography>
        </Box>
      </Grid>
      <Grid size={{ md: 3, xs: 12 }}>
        <Box display={"flex"} flexDirection={"column"}>
          <Typography fontWeight="bold" variant="h6">
            Naviagtion
          </Typography>
          <Typography variant="h6">Dashboard</Typography>
          <Typography variant="h6"> Reports</Typography>
          <Typography variant="h6">Support</Typography>
        </Box>
      </Grid>
      <Grid size={{ md: 3, xs: 12 }}>
        <Box display={"flex"} flexDirection={"column"}>
          <Typography fontWeight="bold" variant="h6">
            Contact
          </Typography>
          <Typography variant="h6">Email</Typography>
          <Typography variant="h6"> Discord</Typography>
          <Typography variant="h6">Phone</Typography>
        </Box>
      </Grid>
    </Grid>
    // </Box>
  )
}
