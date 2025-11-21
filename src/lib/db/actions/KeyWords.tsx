import dayjs from "dayjs"
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
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
import { firestore } from ".."

export const KeyWordActions = {
  AddKeyWord: async (
    userId: string,
    keyword: string,
    marketplaces: string[],
    limitInput: number
  ) => {
    const collectionRef = collection(
      firestore,
      `user_keywords/${userId}/keywords`
    )
    const docRef = doc(collectionRef)

    await setDoc(
      docRef,

      {
        id: docRef.id,
        userId: userId,
        keyword: keyword,
        marketplaces: marketplaces,
        limitInput: limitInput,
        createdAt: Timestamp.fromDate(dayjs().toDate()),
      },
      { merge: true }
    )
    return {
      error: false,
      content: docRef.id,
      message: "Successfully Created Keyword List.",
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
          product_history: d.product_history,
          createdAt: d.createdAt,
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
