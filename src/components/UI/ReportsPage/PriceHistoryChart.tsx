import { Box } from "@mui/material"
import dayjs from "dayjs"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface Props {
  readonly price_history: { name: string; price: number; scrapedAt: number }[]
}
export default function PriceHistoryChart({ price_history }: Props) {
  return (
    <Box>
      <LineChart
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "100%",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={price_history}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="scrapedAt"
          tickFormatter={(value) =>
            `${dayjs(value / 1_000_000).format("MM/DD/YYYY")}`
          }
        />
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </Box>
  )
}
