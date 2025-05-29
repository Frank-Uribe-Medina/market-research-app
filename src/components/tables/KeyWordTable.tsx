import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import * as React from "react"

interface KeyWordData {
  keyword: string
  marketplaces: string[]
  quantity: number
}

const rows: KeyWordData[] = [
  {
    keyword: "Iphone",
    marketplaces: ["amazon", "walmart", "ebay"],
    quantity: 5,
  },
  {
    keyword: "Mattress",
    marketplaces: ["amazon", "ebay"],
    quantity: 10,
  },
  {
    keyword: "Table",
    marketplaces: ["ebay"],
    quantity: 20,
  },
]

export default function KeyWordTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>KeyWord</TableCell>
            <TableCell>Marketplaces</TableCell>
            <TableCell>Result Per Word</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.keyword}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.keyword}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.marketplaces}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
