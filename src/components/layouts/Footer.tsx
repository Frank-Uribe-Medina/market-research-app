import { Box, Grid, Typography } from "@mui/material"

const pages = [
  {
    name: "Product Planner",
    icon: 0,
    href: "/",
    toolTip: "Add keywords here",
  },
  {
    name: "Product Anaylsis",
    icon: 1,
    href: "/analysis",
    toolTip: "This is where the cogs of each product lives",
  },
  // {
  //   name: "Category Planner",
  //   icon: 2,
  //   href: "/",
  //   toolTip: "This is where the cogs of each category lives",
  // },
  {
    name: "Settings",
    icon: 3,
    href: "/settings",
    toolTip: "Reset password, change preferences",
  },
  {
    name: "Help",
    icon: 4,
    href: "/help",
    toolTip:
      "General FAQs About 3PL, and other tutorials on infering this data",
  },
]
const contacts = [
  {
    name: "Contact Email",
    icon: 0,
    href: "mailto:contact@brothersolutions.net",
    toolTip: "Get Support Here",
  },
  {
    name: "contact@brothersolutions.net",
    icon: 1,
    href: "mailto:contact@brothersolutions.net",
    toolTip: "This is where the cogs of each product lives",
  },
]
export default function Footer() {
  return (
    <Grid
      container
      sx={{
        bgcolor: "primary.main",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        pt: 4,
        pb: 4,
        pr: 2,
        pl: 2,
        mt: 4,
      }}
    >
      <Grid
        size={{ md: 12, xs: 12 }}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {" "}
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          component={"a"}
          href="https://brothersolutions.net"
        >
          <img
            src="/assets/images/logo.png"
            alt="Amazon Product Data"
            style={{ objectFit: "contain", height: 75 }}
          />
          <Typography
            variant="h4"
            fontWeight={900}
            flexWrap={"wrap"}
            textAlign={"center"}
          >
            A Brother Solutions Product
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ md: 3, xs: 6 }} display={"flex"} flexDirection={"column"}>
        {pages.map((page) => (
          <Typography key={page.name} component={"a"} href={page.href}>
            {page.name}
          </Typography>
        ))}
      </Grid>
      <Grid size={{ md: 3, xs: 6 }} display={"flex"} flexDirection={"column"}>
        {contacts.map((page) => (
          <Typography key={page.name} component={"a"} href={page.href}>
            {page.name}
          </Typography>
        ))}
      </Grid>
      <Grid size={12} textAlign={"center"}>
        Brother Solutions 2025 ©
      </Grid>
    </Grid>
    // </Box>
  )
}
