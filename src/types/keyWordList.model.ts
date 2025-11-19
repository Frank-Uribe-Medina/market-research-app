import { Timestamp } from "firebase/firestore"

import { NoonProductSnapshot } from "./marketplacedata.model"

export interface BrightDataKeyWordShape {
  keyword: string
  domain?: string
  limitInput: number
}

export interface KeywordShapeFirebase {
  id: string
  userId: string
  keyword: string
  marketplaces: string[]
  limitInput: number
  createdAt: Timestamp
  product_history?: NoonProductSnapshot[]
}
