import dayjs from "dayjs"
import {
  arrayUnion,
  collection,
  deleteDoc,
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
} from "firebase/firestore"

import {
  KeywordShapeFirebase,
  ProductHistory,
} from "../../../types/keyWordList.model"
import { LastKey } from "../../../types/params.model"
import { User } from "../../../types/user.model"
import { firestore } from ".."

export const KeyWordActions = {
  AddKeyWord: async (
    userId: string,
    keyword: string,
    marketplaces: string[],
    limitInput: number,
    isSpecificProduct: boolean,
    subPlan: User["subplan"]
  ) => {
    const collectionRef = collection(
      firestore,
      `user_keywords/${userId}/keywords`
    )
    const snap = await getCountFromServer(collectionRef)
    const key_word_count = snap.data().count
    console.log("Now the count is ", key_word_count)
    console.log("sub plan is ", subPlan)
    if (subPlan === "free" && key_word_count >= 10) {
      return {
        error: true,
        message: "Reached the Max Limit of Keywords.",
        count: key_word_count,
      }
    }
    if (subPlan === "pro" && key_word_count >= 50) {
      return {
        error: true,
        message: "Reached the Max Limit of Keywords.",
        count: key_word_count,
      }
    }
    if (subPlan === "business" && key_word_count >= 300) {
      return {
        error: true,
        message: "Reached the Max Limit of Keywords.",
        count: key_word_count,
      }
    }
    const docRef = doc(collectionRef)
    await setDoc(
      docRef,

      {
        id: docRef.id,
        userId: userId,
        keyword: keyword,
        marketplaces: marketplaces,
        limitInput: limitInput,
        isSpecificProduct: isSpecificProduct,
        createdAt: Timestamp.fromDate(dayjs().toDate()),
      },
      { merge: true }
    )
    return {
      error: false,
      content: docRef.id,
      count: key_word_count,
      message: "Successfully Added Search Term.",
    }
  },
  GetAllKeyWords: async (
    userId: string,
    limitNum: number,
    lastKey: LastKey
  ) => {
    try {
      const constraints: QueryConstraint[] = []
      if (lastKey) {
        constraints.push(startAfter(lastKey.ref))
      }
      constraints.push(orderBy("createdAt", "desc"), limit(limitNum))

      const collectionRef = collection(
        firestore,
        `user_keywords/${userId}/keywords/`
      )
      const count = (await getCountFromServer(collectionRef)).data().count
      const queryRef = query(collectionRef, ...constraints)
      const docsRef = await getDocs(queryRef)

      const temp: KeywordShapeFirebase[] = []
      docsRef.docs.forEach((doc) => {
        const d = doc.data() as KeywordShapeFirebase
        temp.push({
          id: doc.id,
          userId: d.userId,
          keyword: d.keyword,
          marketplaces: d.marketplaces,
          limitInput: d.limitInput,
          isSpecificProduct: d.isSpecificProduct,
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
      console.log("In catch statement")
      const docRef = doc(
        firestore,
        `user_keywords/${userId}/keywords/${keywordId}`
      )
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        throw "List Does not Exist."
      }
      await deleteDoc(docRef)
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
}
