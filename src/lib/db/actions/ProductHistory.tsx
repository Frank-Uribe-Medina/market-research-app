import { collection, doc, getDoc, getDocs } from "firebase/firestore"

import { UserAddedSku } from "../../../types/keyWordList.model"
import { DatabaseProductData } from "../../../types/productdata.model"
import { firestore } from ".."

export const ProductActions = {
  GetAllProductHistory: async (userId: string) => {
    try {
      const userListSkus = collection(firestore, `user_skus/${userId}/skus`)
      const skuSnapshot = await getDocs(userListSkus)
      if (skuSnapshot.empty) {
        return { error: true, message: "User has no list" }
      }
      const skus: string[] = []
      skuSnapshot.docs.forEach((doc) => {
        const data: UserAddedSku = doc.data() as UserAddedSku
        skus.push(data.sku)
      })
      if (skus.length <= 0) {
        return { error: true, message: "Theres no skus to look for" }
      }
      const listProductHistory: DatabaseProductData[] = []
      await Promise.all(
        skus.map(async (sku) => {
          const docRef = doc(firestore, `amazon_products/${sku}/latest/${sku}`)
          const snapshot = await getDoc(docRef)
          if (!snapshot.exists()) {
            console.info({ error: true, message: `${sku} does not exist` })
            return { error: true, message: `${sku} does not exist` }
          }
          listProductHistory.push({
            ...snapshot,
          } as unknown as DatabaseProductData)
        })
      )
      return { error: false, content: listProductHistory }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        content: [],
        lastKey: null,
        message: typeof err === "string" ? err : "Unable to get Keyword List.",
      }
    }
  },
  GetProductHistory: async (userId: string, sku: string) => {
    ///product_history/userid/products/keyword_id
    try {
      const docRef = doc(firestore, `amazon_products/${sku}/latest/${sku}`)
      const snapshot = await getDoc(docRef)
      if (!snapshot.exists()) {
        return { error: true, message: "Document does not exist!" }
      }
      const data = snapshot.data() as DatabaseProductData

      return { error: false, content: data }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message: typeof err === "string" ? err : "Unable to get Keyword List.",
      }
    }
  },
}
