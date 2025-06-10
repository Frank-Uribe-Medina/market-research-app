import {
  Button,
  Chip,
  CircularProgress,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material"
import axios from "axios"
import * as React from "react"
import { toast } from "react-toastify"

import { BucketsShape } from "../../types/snapshots.model"
import { formatFirebaseDate } from "../../utils"

interface Props {
  readonly userId: string
  readonly bucketsData: BucketsShape[]
}

export default function SnapshotsTable({ userId, bucketsData }: Props) {
  const theme = useTheme()

  const handleDownload = async (value: string) => {
    const data = { userId: userId, listId: value }

    toast.success("Download Starting.")

    try {
      const response = await axios.post("/api/downloadsnapshot/", data, {
        responseType: "blob", // treat response as file
      })

      // Create blob URL:
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${value}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      console.log("Download success.")
    } catch (err) {
      console.error("Download failed.", err)
      toast.error("Download failed.")
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
              List Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Date
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bucketsData.length > 0 ? (
            bucketsData?.map((snapshots) => {
              return (
                <TableRow
                  key={snapshots.createdAt}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{snapshots.name}</TableCell>
                  <TableCell>
                    {formatFirebaseDate(
                      snapshots.createdAt,
                      "MM-DD-YYYY h:mm A"
                    )}
                  </TableCell>
                  <TableCell>
                    {snapshots.ready ? (
                      <Chip label="Ready" color="success" />
                    ) : (
                      <Chip
                        label="Running List"
                        color="secondary"
                        icon={
                          <CircularProgress
                            size={14}
                            thickness={5}
                            sx={{ ml: 0.5 }}
                          />
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!snapshots.ready}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                      onClick={() => void handleDownload(snapshots.id)}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              {" "}
              <TableCell>
                <Skeleton></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton></Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton></Skeleton>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
