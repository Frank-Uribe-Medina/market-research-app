import { Timestamp } from "firebase/firestore"

import { NoonProductSnapshot } from "./marketplacedata.model"

export interface BrightDataKeyWordShape {
  keyword: string
  domain?: string
  limitInput: number
}

export interface UserAddedSku {
  id: string
  userId: string
  sku: string
  marketplace: string
  countryCode: number
  createdAt: Timestamp
}

export interface QueueShape {
  id: string
  userId: string
  skus: UserAddedSku[]
}

export interface ProductHistory {
  id: string
  lastScraped: Date
  product_history?: NoonProductSnapshot[]
}
