import { Timestamp } from "firebase/firestore"

export interface DatabaseProductData {
  product_title: string
  sku: string
  market_place_sku: {
    label: string
    sku: string
  }
  url: string
  images: string[]
  brand: string
  current_price: number
  previous_price: number
  priceHistory: PriceHistory[]
  avg_review: number
  review_count: number
  daily_click_est: number
  est_daily_impressions: number
  num_sellers: number
  phrases: TopThing[] | null
  seller: string | null
  currency: string
  seller_shop_url: string | null
  scraped_at: Timestamp | number | Date // ISO string
}
export interface PriceHistory {
  timestampInUTC: number
  price: number
}

export interface TopThing {
  text: string
  count: number
}
