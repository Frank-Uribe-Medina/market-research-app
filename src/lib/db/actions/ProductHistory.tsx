import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
} from "firebase/firestore"

import { ProductHistory } from "../../../types/keyWordList.model"
import { LastKey } from "../../../types/params.model"
import { firestore } from ".."

export const ProductActions = {
  GetAllProductHistory: async (
    userId: string,
    limitNum: number,
    lastKey: LastKey
  ) => {
    ///product_history/userid/products/keyword_id
    try {
      const constraints: QueryConstraint[] = []
      if (lastKey) {
        constraints.push(startAfter(lastKey.ref))
      }
      constraints.push(orderBy("lastScraped", "desc"), limit(limitNum))

      const collectionRef = collection(
        firestore,
        `product_history/${userId}/products/`
      )
      const queryRef = query(collectionRef, ...constraints)
      const docsRef = await getDocs(queryRef)

      const temp: ProductHistory[] = []
      docsRef.docs.forEach((doc) => {
        const d = doc.data() as ProductHistory
        console.log(d)
        temp.push({
          id: doc.id,
          lastScraped: d.lastScraped,
          product_history: d.product_history,
        })
      })
      const lk = docsRef.docs.at(-1)
      console.log(temp)
      return { error: false, content: temp, lastKey: lk }
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
  GetProductHistory: async (userId: string, product_id: string) => {
    ///product_history/userid/products/keyword_id
    try {
      const docRef = doc(
        firestore,
        `product_history/${userId}/products/${product_id}`
      )
      const snapshot = await getDoc(docRef)
      if (!snapshot.exists()) {
        return { error: true, message: "Document does not exist!" }
      }
      const data = snapshot.data() as ProductHistory

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
