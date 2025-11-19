import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material"
import * as React from "react"

import { KeywordShapeFirebase } from "../../types/keyWordList.model"
import DetailedViewModal from "../UI/ReportsPage/DetailedViewModal"

interface Props {
  readonly keywords_list: KeywordShapeFirebase[]
}

export default function SnapshotsTable({ keywords_list }: Props) {
  const theme = useTheme()
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="snapshots table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Input Product Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Marketplaces
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Records
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keywords_list.map((keyword) => (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{keyword.keyword}</TableCell>
              <TableCell>{keyword.marketplaces}</TableCell>
              <TableCell>{keyword.product_history?.length}</TableCell>
              <TableCell>
                <DetailedViewModal
                  disabled={keyword.product_history ? false : true}
                  product_history={keyword.product_history ?? null}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
