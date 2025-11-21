import { Timestamp } from "firebase/firestore"

export interface NoonProductSnapshot {
  jobId: string
  keywordId: string
  sku: string
  url: string
  title: string
  currentPrice: number // or number after cleaning
  pastPrice: number // or number | null
  priceSavingText: number
  reviewCountText: number
  nudgeText: string
  numSellersText: number
  scrapedAt: Timestamp // ISO string
  marketplace: "Noon"
}
