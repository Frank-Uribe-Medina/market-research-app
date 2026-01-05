import { Backdrop, Chip, Grid, Modal, Typography } from "@mui/material"
import Fade from "@mui/material/Fade"
import React from "react"
import { toast } from "react-toastify"
import { useSnapshot } from "valtio"

import state from "../../../contexts/ValtioStore"
import { ProductActions } from "../../../lib/db/actions/ProductHistory"
import { DatabaseProductData } from "../../../types/productdata.model"
import AssetsGrid from "./AssetsGrid"
import BubbleChartSellers from "./BubbleChartSellers"
import CogsChart from "./CogsChart"
import ConversionChart from "./ConversionChart"
import PriceHistoryChart from "./PriceHistoryChart"
import ReviewRadarChart from "./ReviewRadarChart"

interface Props {
  readonly product_id: string
  readonly disabled: boolean
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  p: 3,
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: 960,
  maxHeight: "80vh",
  bgcolor: "background.default",
  borderRadius: 3,
  boxShadow: 24,
  overflow: "auto",
  display: "flex",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundImage:
    "radial-gradient(circle at 0 0, rgba(56,189,248,0.15), transparent 55%), radial-gradient(circle at 100% 100%, rgba(244,114,182,0.18), transparent 55%)",
}

export default function DetailedViewModal({ product_id }: Props) {
  const snap = useSnapshot(state)
  const [open, setOpen] = React.useState(false)
  const [product_history, setProductHistory] =
    React.useState<DatabaseProductData | null>(null)

  const getProductHistory = async () => {
    setOpen(true)
    try {
      const result = await ProductActions.GetProductHistory(
        snap.user?.id ?? "",
        product_id
      )
      if (result.error || !result.content) {
        return toast.error("No results for this Product Yet")
      }
      console.log("we are here", product_history)
      setProductHistory(result.content ?? [])
    } catch (err: any) {
      console.error(err)
      return toast.error("Failed to get this Product Data")
    }
  }

  return (
    <>
      <Chip label="View Cogs" onClick={() => void getProductHistory()} />

      <Modal
        open={open}
        onClose={() => void setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 200 } }}
      >
        <Fade in={open}>
          <Grid container width={"100%"} sx={modalStyle} spacing={2}>
            <Grid
              size={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Detailed View
              </Typography>
            </Grid>

            <Grid size={6} maxHeight={400} height={400}>
              {product_history && (
                <BubbleChartSellers productHistory={product_history} />
              )}
            </Grid>
            <Grid size={6} maxHeight={400} height={400}>
              {product_history && (
                <PriceHistoryChart productHistory={product_history} />
              )}
            </Grid>
            <Grid size={6} height={500}>
              {product_history && (
                <ReviewRadarChart productHistory={product_history} />
              )}
            </Grid>
            <Grid size={6} height={500}>
              {product_history && (
                <AssetsGrid productHistory={product_history} />
              )}
            </Grid>
            <Grid size={6} height={500}>
              <ConversionChart />
            </Grid>
            <Grid size={6} height={500}>
              <CogsChart />
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    </>
  )
}
