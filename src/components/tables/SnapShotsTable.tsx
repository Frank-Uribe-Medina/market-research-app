import { AsyncParser } from "@json2csv/node"
import DownloadIcon from "@mui/icons-material/Download"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import {
  Checkbox,
  IconButton,
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
import { ProductActions } from "../../lib/db/actions/ProductHistory"
import { KeywordShapeFirebase } from "../../types/keyWordList.model"
import { formatFirebaseDate } from "../../utils"
import DetailedViewModal from "../UI/ReportsPage/DetailedViewModal"

interface Props {
  readonly keywords_list: KeywordShapeFirebase[]
}

export default function SnapshotsTable({ keywords_list }: Props) {
  const theme = useTheme()
  const snap = useSnapshot(state)

  const [ids, setIds] = React.useState<string[]>([])
  const handleChecked = (id: string) => {
    if (ids.includes(id)) {
      setIds(ids.filter((item) => item !== id))
      console.log(`This is the Id of what was unchecked ${id}`)
      return
    }
    setIds((prev) => [...prev, id])
    console.log(`This is the Id of what was checked ${id}`)
  }

  const handleDownload = async () => {
    try {
      const parser = new AsyncParser()

      await Promise.all(
        ids.map(async (id) => {
          const data = await ProductActions.GetProductHistory(
            snap.user?.id ?? "",
            id
          )
          if (!data.content?.product_history) {
            return { error: true, message: "No Product History for this " }
          }
          const csv = await parser
            .parse(JSON.stringify(data.content.product_history))
            .promise()
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
          const url = URL.createObjectURL(blob)

          const link = document.createElement("a")
          link.href = url
          link.setAttribute(
            "download",
            `${formatFirebaseDate(data.content.lastScraped)}`
          )
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        })
      )
    } catch (err: any) {
      console.error(err)
      return { error: true, message: "Failed to conver tot cs" }
    }
  }
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
              Input Product Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              <Tooltip title="Where this data is directly coming from.">
                <InfoOutlineIcon fontSize={"small"} />
              </Tooltip>
              Marketplaces
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
              Records
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Actions
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                width: "content-fit",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {" "}
              <Tooltip title="Check the Items you want to download as a csv file. Or if you just want a quick snapshot of the data we collected for you. Just hit the Target !">
                <InfoOutlineIcon fontSize={"small"} />
              </Tooltip>
              Download
              <IconButton
                sx={{
                  transition: "transform 250ms ease",
                  transform: ids.length >= 1 ? "scale(1)" : "scale(0.8)",
                  visibility: ids.length >= 1 ? "visible" : "hidden",
                }}
                onClick={() => void handleDownload()}
              >
                <DownloadIcon />
              </IconButton>
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
              <TableCell>{keyword.isSpecificProduct ? "Yes" : "No"}</TableCell>
              <TableCell>
                <DetailedViewModal
                  product_id={keyword.id}
                  disabled={keyword.id ? false : true}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={ids.includes(keyword.id)}
                  onChange={() => handleChecked(keyword.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
