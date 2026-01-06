import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
} from "@mui/material"
import * as React from "react"
import { useSnapshot } from "valtio"

import state from "../../contexts/ValtioStore"
import { UserAddedSku } from "../../types/keyWordList.model"
import DetailedViewModal from "../UI/ReportsPage/DetailedViewModal"

interface Props {
  readonly keywords_list: UserAddedSku[]
}

export default function SnapshotsTable({ keywords_list }: Props) {
  const theme = useTheme()
  const snap = useSnapshot(state)
  console.log(snap.user)
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
              <Tooltip title="The Search Term that was">
                <InfoOutlineIcon fontSize={"small"} />
              </Tooltip>
              Sku
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              <Tooltip title="Where this data is directly coming from.">
                <InfoOutlineIcon fontSize={"small"} />
              </Tooltip>
              Marketplace
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              <Tooltip title="Quickly see how much was collected of historical data so far.">
                <InfoOutlineIcon fontSize={"small"} />
              </Tooltip>
              Country
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keywords_list.map((keyword) => (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{keyword.sku}</TableCell>
              <TableCell>
                <Chip label={keyword.marketplace} />
              </TableCell>
              <TableCell>{keyword.countryCode}</TableCell>
              <TableCell>
                <DetailedViewModal
                  product_id={keyword.sku}
                  disabled={keyword.id ? false : true}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
