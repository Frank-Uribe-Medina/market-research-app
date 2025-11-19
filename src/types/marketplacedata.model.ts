export interface NoonProductSnapshot {
  jobId: string
  keywordId: string
  sku: string
  url: string
  title: string
  currentPrice: string // or number after cleaning
  pastPrice: string // or number | null
  priceSavingText: string
  reviewCountText: string
  nudgeText: string
  numSellersText: string
  scrapedAt: string // ISO string
  marketplace: "noon_eg"
}
