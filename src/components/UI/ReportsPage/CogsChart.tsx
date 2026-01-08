/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable eqeqeq */
import { Box, Paper, Typography, useTheme } from "@mui/material"
import { MessageCircleMore } from "lucide-react"
import {
  Cell,
  Pie,
  PieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
} from "recharts"

import { DatabaseProductData } from "../../../types/productdata.model"

// #region Sample data

const RADIAN = Math.PI / 180
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  payload,
}: PieLabelRenderProps) => {
  if (
    cx == null ||
    cy == null ||
    innerRadius == null ||
    outerRadius == null ||
    !payload
  ) {
    //This part is necessary as I cant seem to chain these
    return null
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const ncx = Number(cx)
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
  const ncy = Number(cy)
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {` ${payload.name} $${payload.value.toFixed(0)}`}
    </text>
  )
}

interface Props {
  readonly productHistory: DatabaseProductData
}
export default function CogsChart({ productHistory }: Props) {
  const theme = useTheme().palette
  const shipping = 2
  const sellerFees = productHistory.current_price * 0.15
  const cost = productHistory.current_price - (sellerFees + shipping)
  const profit = productHistory.current_price - cost
  const data01 = [
    { name: "Shipping", value: shipping },
    {
      name: "Cost",
      value: cost,
    },
    { name: "Profit", value: profit },
    { name: "Seller Fees", value: sellerFees },
  ]
  return (
    <Paper
      elevation={2}
      sx={{ p: 4, borderRadius: 2, height: "100%", width: "100%" }}
    >
      <Box display={"flex"} flexDirection={"column"}>
        <Typography
          fontWeight={900}
          fontSize={22}
          display={"flex"}
          gap={1}
          alignItems={"center"}
        >
          <MessageCircleMore /> COGS
        </Typography>
        <Box>
          <Typography fontSize={22} color={theme.grey[400]}>
            Cost of goods sold, broken up by what we estimated is the overall
            cost of this SKU.
          </Typography>
        </Box>
      </Box>
      <ResponsiveContainer height={300}>
        <PieChart
          style={{
            aspectRatio: 1,
          }}
          responsive
        >
          <Pie
            data={data01}
            labelLine={true}
            label={renderCustomizedLabel}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
          >
            {data01.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  )
}
