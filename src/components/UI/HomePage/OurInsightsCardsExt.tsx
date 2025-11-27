import { Box, Button, Grid, Typography, useTheme } from "@mui/material"
import { Cloud, Handshake, Radio } from "lucide-react"

const insights = [
  {
    btnLabel: "Get custom insights",
    icon: 0,
    heading: "Real-Time Data",
    caption: "Your end-to-end Amazon and Noon data growth engine",
    caption2:
      "We empower brands to unlock new revenue by delivering a more complete view of the Amazon and the Noon landscape with real-time data, driving actionable insi.",
  },
  {
    btnLabel: "Get Data Delivered",
    icon: 1,
    heading: "Cloud",
    caption:
      "Big data from the world’s largest marketplace – tailored your way",
    caption2:
      "Ingest millions of Amazon data points through the collection and reporting tools of your choice. Visualize, optimize and integrate data into your omnichannel sales strategy.",
  },
  {
    btnLabel: "Get Real Time Data",
    icon: 2,
    heading: "Consult",
    caption: "Drive rapid growth with tailored amazon and noon reporting",
    caption2:
      "Get executive-level reporting and strategic advice on Amazon – done for you. By leveraging tailored guidance and insights, brands can enhance their Amazon presence and competitiveness.",
  },
]

export default function OurInsightsCards() {
  const theme = useTheme()
  return (
    <Grid container spacing={2}>
      {insights.map((insight) => (
        <Grid
          size={4}
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box
            display={"flex"}
            gap={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {insight.icon === 0 ? (
              <Radio color={theme.palette.primary.main} size={28} />
            ) : (
              <></>
            )}{" "}
            {insight.icon === 1 ? (
              <Cloud color={theme.palette.secondary.main} size={28} />
            ) : (
              <></>
            )}
            {insight.icon === 2 ? (
              <Handshake color={theme.palette.success.main} size={28} />
            ) : (
              <></>
            )}{" "}
            <Typography
              fontWeight={900}
              variant="h3"
              width={"100%"}
              align="left"
            >
              {insight.heading}{" "}
            </Typography>
          </Box>

          <Typography variant="h6">{insight.caption}</Typography>
          <Typography>{insight.caption2}</Typography>
          <Button variant="outlined" sx={{ borderRadius: 10 }}>
            {insight.btnLabel}{" "}
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}
