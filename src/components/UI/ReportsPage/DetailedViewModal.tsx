import AdsClickIcon from "@mui/icons-material/AdsClick"
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
import React from "react"
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { NoonProductSnapshot } from "../../../types/marketplacedata.model"

type ViewMode = "table" | "priceDiscount"

// Treat a single snapshot as one row of history.
// Props expects an array of these.
interface Props {
  readonly product_history: NoonProductSnapshot[] | null
  readonly disabled: boolean
}

// --------- helpers ---------

const parseNumber = (value: string | undefined | null): number | null => {
  if (!value) return null
  const num = parseFloat(value.replace(/[^\d.]/g, ""))
  return Number.isNaN(num) ? null : num
}

const parseDiscount = (priceSavingText?: string | null): number | null => {
  if (!priceSavingText) return null
  // eslint-disable-next-line sonarjs/slow-regex
  const match = RegExp(/(\d+(?:\.\d+)?)\s*%/).exec(priceSavingText)
  return match ? parseFloat(match[1]) : null
}

const useDerivedData = (history: NoonProductSnapshot[] | null) => {
  const rows = React.useMemo(() => {
    if (!history) return []
    return history.map((item, index) => {
      const currentPrice = parseNumber(item.currentPrice as any)
      const pastPrice = parseNumber(item.pastPrice as any)
      const discountPercent =
        parseDiscount(item.priceSavingText as any) ??
        (currentPrice && pastPrice
          ? (1 - currentPrice / pastPrice) * 100
          : null)

      return {
        id: index,
        sku: item.sku ?? "",
        title: item.title ?? "",
        marketplace: item.marketplace ?? "",
        currentPrice,
        pastPrice,
        discountPercent,
        scrapedAt: item.scrapedAt ?? "",
      }
    })
  }, [history])

  const priceDiscountData = React.useMemo(
    () =>
      rows.map((row) => ({
        name: row.sku || row.title.slice(0, 12),
        price: row.currentPrice,
        discount: row.discountPercent,
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

export default function DetailedViewModal({
  product_history,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<ViewMode>("table")

  const { rows, priceDiscountData } = useDerivedData(product_history)

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
        onClick={() => setOpen(true)}
        color="secondary"
        disabled={disabled}
      >
        <AdsClickIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
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
                        sx={{ mt: 0.5 }}
                        noWrap
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
                                  <TableCell sx={{ maxWidth: 260 }}>
                                    {row.title}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.currentPrice !== null
                                      ? `EGP ${row.currentPrice.toFixed(2)}`
                                      : "-"}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.pastPrice !== null
                                      ? `EGP ${row.pastPrice.toFixed(2)}`
                                      : "-"}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.discountPercent !== null
                                      ? `${row.discountPercent.toFixed(1)}%`
                                      : "-"}
                                  </TableCell>
                                  <TableCell>{row.scrapedAt}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      )}

                      {view === "priceDiscount" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={priceDiscountData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="price" name="Price (EGP)" />
                            <Bar dataKey="discount" name="Discount (%)" />
                          </BarChart>
                        </ResponsiveContainer>
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
