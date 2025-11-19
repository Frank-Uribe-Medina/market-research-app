import { KeywordShapeFirebase } from "../types/keyWordList.model"

export class MarketPlaceParser {
  keyword: KeywordShapeFirebase | null
  base_url: string
  limitInput: number
  constructor() {
    this.keyword = null
    this.base_url = ""
    this.limitInput = 0
  }
}
