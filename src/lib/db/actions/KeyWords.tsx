import dayjs from "dayjs"
import {
  arrayUnion,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore"

import { ProductHistory, UserAddedSku } from "../../../types/keyWordList.model"
import { LastKey } from "../../../types/params.model"
import { User } from "../../../types/user.model"
import { firestore } from ".."

export const KeyWordActions = {
  AddSKu: async (
    userId: string,
    sku: string,
    marketplace: string,
    countryCode: number,
    subPlan: User["subplan"]
  ) => {
    const collectionRef = collection(firestore, `user_skus/${userId}/skus`)
    const snap = await getCountFromServer(collectionRef)
    const sku_count = snap.data().count
    if (subPlan === "free" && sku_count >= 10) {
      return {
        error: true,
        message: "Reached the Max Limit of Keywords.",
        count: sku_count,
      }
    }
    if (subPlan === "pro" && sku_count >= 50) {
      return {
        error: true,
        message: "Reached the Max Limit of Keywords.",
        count: sku_count,
      }
    }
    if (subPlan === "business" && sku_count >= 300) {
      return {
        error: true,
        message: "Reached the Max Limit of Keywords.",
        count: sku_count,
      }
    }
    const docRef = doc(collectionRef)
    await setDoc(
      docRef,

      {
        id: docRef.id,
        userId: userId,
        sku: sku,
        marketplace: marketplace,
        countryCode: countryCode,
        deleted: false,
        createdAt: Timestamp.fromDate(dayjs().toDate()),
      } as UserAddedSku,
      { merge: true }
    )
    return {
      error: false,
      content: docRef.id,
      count: sku_count,
      message: "Successfully Added Search Term.",
    }
  },
  GetAllUserSkus: async (
    userId: string,
    limitNum: number,
    lastKey: LastKey
  ) => {
    try {
      const constraints: QueryConstraint[] = []
      if (lastKey) {
        constraints.push(startAfter(lastKey.ref))
      }
      constraints.push(
        orderBy("createdAt", "desc"),
        limit(limitNum),
        where("deleted", "==", false)
      )

      const collectionRef = collection(firestore, `user_skus/${userId}/skus/`)
      const count = (await getCountFromServer(collectionRef)).data().count
      const queryRef = query(collectionRef, ...constraints)
      const docsRef = await getDocs(queryRef)

      const temp: UserAddedSku[] = []
      docsRef.docs.forEach((doc) => {
        const d = doc.data() as UserAddedSku
        temp.push({
          id: doc.id,
          userId: d.userId,
          sku: d.sku,
          marketplace: d.marketplace,
          countryCode: d.countryCode,
          createdAt: d.createdAt,
        })
      })
      const lk = docsRef.docs.at(-1)
      return { error: false, content: temp, lastKey: lk, count: count }
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
  UpdateKeyWordListWithNewKeyWords: async (
    userId: string,
    listId: string,
    data: any
  ) => {
    try {
      const docRef = doc(firestore, `/userlists/${userId}/lists/${listId}`)
      await updateDoc(docRef, { keyWords: arrayUnion(data) })
      return {
        error: false,
        message: "Successfully Added Key Word to List",
      }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message: typeof err === "string" ? err : "Unable to Add KeyWord.",
      }
    }
  },
  DeleteKeyWord: async (userId: string, keywordId: string) => {
    //         `user_keywords/${userId}/keywords/${keywordId}`
    try {
      const docRef = doc(firestore, `user_skus/${userId}/skus/${keywordId}`)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        throw "List Does not Exist."
      }
      await updateDoc(docRef, { deleted: true })
      return {
        error: false,
        message: "Successfully Deleted Keyword.",
      }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message:
          typeof err === "string" ? err : "Unable to delete keyword from list.",
      }
    }
  },
  GetAllProductHistory: async (
    userId: string,
    limitNum: number,
    lastKey: LastKey
  ) => {
    ///product_history/2MPYYIhjYBQdOEwICxgyXb08oPY2/products/GmFC5m4KUD4krc1RV699
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
        temp.push({
          id: doc.id,
          lastScraped: d.lastScraped,
          product_history: d.product_history,
        })
      })
      const lk = docsRef.docs.at(-1)
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
}
