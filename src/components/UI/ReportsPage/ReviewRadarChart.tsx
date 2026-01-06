import { Box, Paper, Typography, useTheme } from "@mui/material"
import { MessageCircleMore } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { DatabaseProductData } from "../../../types/productdata.model"

interface RadarData {
  phrase: string
  count: number
  fullMark: 150
}
// #endregion
interface Props {
  readonly productHistory: DatabaseProductData
  readonly isAnimationActive?: boolean
}

const addMaxToRadar = (productHistory: DatabaseProductData) => {
  const data: RadarData[] = []

  productHistory.phrases?.map((phrase) => {
    data.push({ phrase: phrase.text, count: phrase.count, fullMark: 150 })
  })
  return data
}
export default function ReviewRadarChart({
  productHistory,
  isAnimationActive = true,
}: Props) {
  const theme = useTheme().palette
  const data = addMaxToRadar(productHistory)
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
          <MessageCircleMore /> Reccuring Review Topics
        </Typography>
        <Box borderBottom={4}>
          <Typography fontSize={22} color={theme.grey[400]}>
            What customers are saying about this product.
          </Typography>
        </Box>
      </Box>
      <RadarChart
        style={{
          height: 300,
        }}
        responsive
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="phrase" />
        <Radar
          name="Most Repeated words"
          dataKey="count"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
          isAnimationActive={isAnimationActive}
        />
      </RadarChart>
    </Paper>
  )
}
