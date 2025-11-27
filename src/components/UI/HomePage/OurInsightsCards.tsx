import { Button, Grid, Typography, useTheme } from "@mui/material"

const insights = [
  {
    heading: "Find ground gaining opportunites",
    caption:
      "See what others are already doing, measure marketplace from already proven brands, defend your position and enact datadriven growth strategies. Over half of sellers on Noon/Amazon areleveraging data for both innovation and pricing power",
    btnlabel: "Market Research",
    borderColor: "primary.main",
  },
  {
    heading: "Use Noons/Amazons brand marketing power",
    caption:
      "Amazon is more than a marketplace—it’s where 56% of shoppers begin their search. Take control by eliminating unauthorized sellers, securing the Buy Box, and enhancing your brand with shopper-centric content.",
    btnlabel: "Market Edge",
    borderColor: "secondary.main",
  },
  {
    heading: "Earn more sales, win on shelf and measure effectively",
    caption:
      "What happens on Amazon and Noon influences every channel. Optimize advertising when shoppers are most likely to buy and bulletproof your keyword strategy based on real-time consumer demand and market shifts.",
    btnlabel: "Campaign Optimization",
    borderColor: "text.primary",
  },
]

export default function OurInsightsCards() {
  const theme = useTheme()
  return (
    <Grid container spacing={2}>
      {insights.map((insight) => (
        <Grid
          size={4}
          bgcolor={theme.palette.grey[900]}
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            fontWeight={900}
            sx={{
              borderTop: 5,
              borderColor: `primary.main`,
            }}
            variant="h4"
            width={"100%"}
            align="center"
          >
            {insight.heading}{" "}
          </Typography>
          <Typography>{insight.caption}</Typography>
          <Button
            variant="outlined"
            sx={{ borderRadius: 10, width: "fit-content" }}
          >
            {insight.btnlabel}{" "}
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}
