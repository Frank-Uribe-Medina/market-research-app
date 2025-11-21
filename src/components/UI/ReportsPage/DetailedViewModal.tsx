import AdsClickIcon from "@mui/icons-material/AdsClick"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import Fade from "@mui/material/Fade"
import dayjs from "dayjs"
import React from "react"
import { toast } from "react-toastify"
import { useSnapshot } from "valtio"

import state from "../../../contexts/ValtioStore"
import { ProductActions } from "../../../lib/db/actions/ProductHistory"
import { ProductHistory } from "../../../types/keyWordList.model"
import { NoonProductSnapshot } from "../../../types/marketplacedata.model"
import { formatFirebaseDate } from "../../../utils"
import PriceHistoryChart from "./PriceHistoryChart"

type ViewMode = "table" | "priceDiscount"

// Treat a single snapshot as one row of history.
// Props expects an array of these.
interface Props {
  readonly product_id: string
  readonly disabled: boolean
}

// --------- helpers ---------

const useDerivedData = (history: NoonProductSnapshot[] | null) => {
  const rows = React.useMemo(() => {
    if (!history) return []
    return history.map((item, index) => {
      const currentPrice = item.currentPrice
      const pastPrice = item.pastPrice
      const discountPercent =
        item.priceSavingText ??
        (currentPrice && pastPrice
          ? (1 - currentPrice / pastPrice) * 100
          : null)

      return {
        id: index,
        sku: item.sku ?? "",
        title: item.title ?? "",
        url: item.url ?? "",
        marketplace: item.marketplace ?? "",
        currentPrice,
        pastPrice,
        discountPercent,
        scrapedAt: item.scrapedAt ?? dayjs().toDate(),
      }
    })
  }, [history])

  const priceDiscountData = React.useMemo(
    () =>
      rows.map((row) => ({
        name: row.sku || row.title.slice(0, 12),
        price: row.currentPrice,
        scrapedAt:
          dayjs.utc(formatFirebaseDate(row.scrapedAt)).valueOf() * 1000000,
      })),
    [rows]
  )

  return { rows, priceDiscountData }
}

// --------- styles ---------

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: 960,
  maxHeight: "80vh",
  bgcolor: "background.default",
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column" as const,
  gap: 2,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundImage:
    "radial-gradient(circle at 0 0, rgba(56,189,248,0.15), transparent 55%), radial-gradient(circle at 100% 100%, rgba(244,114,182,0.18), transparent 55%)",
}

export default function DetailedViewModal({ product_id, disabled }: Props) {
  const snap = useSnapshot(state)
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<ViewMode>("table")
  const [product_history, setProductHistory] =
    React.useState<ProductHistory | null>(null)

  const getProductHistory = async (value: boolean) => {
    setOpen(value)
    try {
      const result = await ProductActions.GetProductHistory(
        snap.user?.id ?? "",
        product_id
      )
      if (result.error || !result.content) {
        return toast.error("No results for this Product Yet")
      }
      console.log(result.content)
      setProductHistory(result.content ?? [])
    } catch (err: any) {
      console.error(err)
      return toast.error("Failed to get this Product Data")
    }
  }

  const { rows, priceDiscountData } = useDerivedData(
    product_history?.product_history ?? []
  )
  console.log("Is this in the right format", priceDiscountData)
  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    next: ViewMode | null
  ) => {
    if (next) setView(next)
  }

  const hasData = rows.length > 0
  const latest = hasData ? rows[0] : null

  return (
    <>
      <IconButton
        onClick={() => void getProductHistory(true)}
        color="secondary"
        disabled={disabled}
      >
        <AdsClickIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={() => void getProductHistory(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 200 } }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            {!product_history ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Product History
                    </Typography>
                    {latest && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        {latest.title}
                      </Typography>
                    )}
                    {!hasData && (
                      <Typography variant="body2" color="text.secondary">
                        No history available.
                      </Typography>
                    )}
                  </Box>

                  <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    size="small"
                  >
                    <ToggleButton value="table">Table</ToggleButton>
                    <ToggleButton value="priceDiscount">
                      Price vs Discount
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Content */}
                <Box
                  sx={{
                    flex: 1,
                    mt: 1,
                    borderRadius: 2,
                    bgcolor: "rgba(15,23,42,0.8)",
                    border: "1px solid rgba(148,163,184,0.3)",
                    p: 1.5,
                    minHeight: 260,
                  }}
                >
                  {!hasData ? (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Nothing to visualize yet.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {view === "table" && (
                        <Box
                          sx={{
                            maxHeight: "100%",
                            overflow: "auto",
                          }}
                        >
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>URL</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell align="right">
                                  Current Price
                                </TableCell>
                                <TableCell align="right">Past Price</TableCell>
                                <TableCell align="right">Discount %</TableCell>
                                <TableCell>Scraped At</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row) => (
                                <TableRow key={row.id} hover>
                                  <TableCell>{row.sku}</TableCell>

                                  <TableCell
                                    sx={{
                                      maxWidth: 260,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxHeight: 10,
                                      textWrap: "nowrap",
                                    }}
                                  >
                                    <IconButton
                                      href={row.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <OpenInNewIcon />
                                    </IconButton>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      maxWidth: 260,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxHeight: 10,
                                      textWrap: "nowrap",
                                    }}
                                  >
                                    {row.title}
                                  </TableCell>
                                  <TableCell align="right">
                                    {`EGP ${row.currentPrice.toFixed(2)}`}
                                  </TableCell>
                                  <TableCell align="right">
                                    {`EGP ${row.pastPrice.toFixed(2)}`}
                                  </TableCell>
                                  <TableCell align="right">
                                    {`${row.discountPercent.toFixed(1)}%`}
                                  </TableCell>
                                  <TableCell>
                                    {dayjs(
                                      formatFirebaseDate(row.scrapedAt)
                                    ).format("MM/DD/YY")}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      )}

                      {view === "priceDiscount" && (
                        <PriceHistoryChart price_history={priceDiscountData} />
                      )}
                    </>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
