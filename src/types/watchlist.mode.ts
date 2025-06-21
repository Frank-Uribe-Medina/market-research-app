import { Timestamp } from "firebase/firestore"

export interface WatchListProduct {
  id: string
  productId: string
  productTitle: string
  marketPlace: string
  latestPrice: number
  productImage?: [string]
  priceHistory: { price: number; timestamp: Timestamp | string }[]
  createdAt: Timestamp | string
}

export interface PriceHistoryShape {
  price: number
  timestamp: Timestamp | string
}
