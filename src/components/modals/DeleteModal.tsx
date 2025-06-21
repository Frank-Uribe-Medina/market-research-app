import { Button } from "@mui/material"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import * as React from "react"

import { WatchListProduct } from "../../types/watchlist.mode"
import LineChart from "../charts/LineChart"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
}

interface Props {
  readonly handleClose: (value: boolean) => void
  readonly open: boolean
  readonly data?: WatchListProduct | null
  readonly handleDelete: (value: string) => Promise<void>
}

export default function DeleteModal({
  handleClose,
  open,
  data,
  handleDelete,
}: Props) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display={"flex"} flexDirection={"column"}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you Sure you want to delete?
          </Typography>
          <LineChart data={data?.priceHistory ?? []} />
          <Button
            onClick={() => void handleDelete(data?.id ?? "")}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </Box>
      </Modal>
    </div>
  )
}
