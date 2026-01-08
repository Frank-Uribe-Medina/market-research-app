import {
  Box,
  Paper,
  Tooltip as ToolTipMUI,
  Typography,
  useTheme,
} from "@mui/material"
import dayjs from "dayjs"
import { ArrowDown, ArrowUp, CircleDollarSign } from "lucide-react"
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

import { DatabaseProductData } from "../../../types/productdata.model"

interface PriceHistoryChart {
  dateInMiliSecondsUTC: number
  price: number
  label: string
}

interface Props {
  readonly productHistory: DatabaseProductData
}
export default function PriceHistoryChart({ productHistory }: Props) {
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
          <CircleDollarSign />
          Price History
        </Typography>
        <Box>
          <ToolTipMUI title={productHistory.product_title}>
            <Typography fontSize={22} color={theme.grey[400]} noWrap>
              {productHistory.product_title}
            </Typography>
          </ToolTipMUI>

          <Box display={"flex"}>
            <Typography fontSize={22} marginRight={2}>
              {productHistory.current_price}
              <span style={{ color: theme.grey[400] }}>
                {" " + productHistory.currency}
              </span>
            </Typography>

            <Typography
              color={
                productHistory.previous_price < productHistory.current_price
                  ? theme.success.main
                  : theme.error.main
              }
              fontWeight={500}
            >
              {(
                (productHistory.current_price - productHistory.previous_price) /
                productHistory.previous_price
              ).toFixed(2)}
              %
            </Typography>
            {productHistory.previous_price < productHistory.current_price ? (
              <ArrowUp color={theme.success.main} />
            ) : (
              <ArrowDown color={theme.error.main} />
            )}
          </Box>
        </Box>
      </Box>
      <LineChart
        style={{
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
          padding: 30,
        }}
        responsive
        data={productHistory.priceHistory}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="timestampInUTC"
          tickFormatter={(value) => `${dayjs(value).format("MM/DD/YYYY")}`}
        />
        <YAxis width="auto" dataKey={"price"} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </Paper>
  )
}
