/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Box, Paper, Typography, useTheme } from "@mui/material"
import { MousePointerClick } from "lucide-react"
import {
  Layer,
  Rectangle,
  ResponsiveContainer,
  Sankey,
  Tooltip,
} from "recharts"

import { DatabaseProductData } from "../../../types/productdata.model"

// #endregion
function MyCustomSankeyNode({ x, y, width, height, index, payload }: any) {
  const theme = useTheme().palette
  const isRightSide = true

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#5192ca"
        fillOpacity={1}
      />
      <text
        textAnchor={isRightSide ? "start" : "end"}
        x={isRightSide ? x + width + 6 : x - 6}
        y={y + height / 2}
        fontSize={16}
        fill={theme.text.primary}
      >
        {payload.name}
      </text>
      <text
        textAnchor={isRightSide ? "start" : "end"}
        x={isRightSide ? x + width + 6 : x - 6}
        y={y + height / 2 + 18}
        fontSize={14}
        fill={theme.text.primary}
        fillOpacity={0.75}
      >
        {`${payload.value}`}
      </text>
    </Layer>
  )
}
interface Props {
  readonly productHistory: DatabaseProductData
}

export default function ConversionChart({ productHistory }: Props) {
  const theme = useTheme().palette
  const data = {
    nodes: [
      { name: "Impressions" }, // 0
      { name: "Clicks" }, // 1
      { name: "Purchases" }, // 2
    ],
    links: [
      { source: 0, target: 1, value: productHistory.daily_click_est || 1 },
      {
        source: 1,
        target: 2,
        value: productHistory.daily_click_est * 0.05 || 1,
      },
      // Removed the invalid 2 → 3 link
    ],
  }
  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Box display={"flex"} flexDirection={"column"} marginBottom={4}>
        <Typography
          fontWeight={900}
          fontSize={22}
          display={"flex"}
          gap={1}
          alignItems={"center"}
        >
          <MousePointerClick /> Conversion Data
        </Typography>
        <Box>
          <Typography fontSize={22} color={theme.grey[400]}>
            Estimated Conversion, this gets better with time.
          </Typography>
        </Box>
      </Box>
      <ResponsiveContainer width="100%" aspect={2}>
        <Sankey
          data={data}
          node={MyCustomSankeyNode}
          nodePadding={2}
          link={{ stroke: "#77c878" }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </Paper>
  )
}
