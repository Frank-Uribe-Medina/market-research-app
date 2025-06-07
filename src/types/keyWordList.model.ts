import { Timestamp } from "firebase/firestore"

export interface KeyWordObjectModal {
  id: string
  keyWords: KeyWordShape[]
  createdAt: Timestamp
  name: string
  ready: boolean
}

export interface KeyWordShape {
  keyword: string
  marketplaces: string[]
  quantity: number
}

export interface BrightDataKeyWordShape {
  keyword: string
  domain?: string
  limitInput: number
}
