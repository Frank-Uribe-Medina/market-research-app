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

// #region Sample data
const data0 = {
  nodes: [
    { name: "Visit" },
    { name: "Impressions" },
    { name: "Click Rate" },
    { name: "Purchases" },
  ],
  links: [
    { source: 0, target: 1, value: 3728.3 },
    { source: 1, target: 2, value: 1500 },
    { source: 2, target: 3, value: 500 },
  ],
}

// #endregion
function MyCustomSankeyNode({ x, y, width, height, index, payload }: any) {
  const theme = useTheme().palette
  const isOut = x + width + 6
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#5192ca"
        fillOpacity="1"
      />
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="16"
        fill={theme.text.primary}
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 20}
        fontSize="16"
        fill={theme.text.primary}
        fillOpacity="0.75"
      >
        {`${payload.value}k`}
      </text>
    </Layer>
  )
}

export default function ConversionChart() {
  const theme = useTheme().palette
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
          data={data0}
          node={MyCustomSankeyNode}
          nodePadding={50}
          link={{ stroke: "#77c878" }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </Paper>
  )
}
