// components/charts/LineChart.tsx

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { PriceHistoryShape } from "../../types/watchlist.mode"

interface Props {
  data: PriceHistoryShape[]
}

const LineChart = ({ data }: Props) => {
  const formattedData: PriceHistoryShape[] = data.map((item) => ({
    ...item,
    time: new Date(
      typeof item.timestamp === "string"
        ? item.timestamp
        : item.timestamp.toDate()
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsLineChart
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 20, left: -10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis dataKey="price" tick={{ fontSize: 12 }} />
        <Tooltip
          labelFormatter={(value) => `Time: ${value}`}
          formatter={(value) => [`$${value}`, "Price"]}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#1976d2"
          strokeWidth={3}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export default LineChart
