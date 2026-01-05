import { Box, Paper, Typography, useTheme } from "@mui/material"
import { UsersRound } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { DatabaseProductData } from "../../../types/productdata.model"

// #region Sample data

interface Props {
  productHistory: DatabaseProductData
}
interface ChartData {
  x: number
  y: number
  label: string
}
const converToChartData = (unformattedData: DatabaseProductData) => {
  const chartData: ChartData[] = []
  const sellers = unformattedData.num_sellers

  for (let i = 0; i <= sellers; i++) {
    chartData.push({
      x: i + 1,
      y: i + 1,
      label: `Seller Number ${i + 1}`,
    })
  }
  return chartData
}
// #endregion
const BubbleChartSellers = ({ productHistory }: Props) => {
  const data = converToChartData(productHistory)
  console.log(data)
  const theme = useTheme().palette
  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2, height: "100%" }}>
      <Box display={"flex"} flexDirection={"column"}>
        <Typography
          fontWeight={900}
          fontSize={22}
          display={"flex"}
          gap={1}
          alignItems={"center"}
        >
          <UsersRound />
          Number of Sellers
        </Typography>
        <Box>
          <Typography fontSize={22} color={theme.grey[400]}>
            Sellers who are also selling this SKU
          </Typography>
        </Box>
      </Box>

      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <XAxis dataKey="x" hide />
        <YAxis width="auto" hide />
        <Bar dataKey="x" fill="#82ca9d" radius={[10, 10, 0, 0]} label />
      </BarChart>
    </Paper>
  )
}

export default BubbleChartSellers
