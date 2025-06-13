import dayjs from "dayjs"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  Timestamp,
} from "firebase/firestore"

import { firestore } from ".."

export const WatchListActions = {
  CreateWatchList: async (userId: string) => {
    const collectionRef = collection(firestore, `watchlists/${userId}/products`)
    const docRef = doc(collectionRef)
    await setDoc(docRef, {
      id: docRef.id,
      createdAt: Timestamp.fromDate(dayjs().toDate()),
    })
  },
  GetAllProductsFromWatchList: async (userId: string, limitNum: number) => {
    try {
      const constraints: QueryConstraint[] = []
      constraints.push(orderBy("createdAt", "desc"), limit(limitNum))
      const collectionRef = collection(
        firestore,
        `watchlists/${userId}/products`
      )
      const queryRef = query(collectionRef, ...constraints)
      const docsRef = await getDocs(queryRef)

      const temp: any[] = []
      docsRef.docs.forEach((doc) => {
        const d = doc.data()
        temp.push({
          id: d.id ?? "",
          latestPrice: d.latestPrice ?? 0,
          marketplace: d.marketPlace ?? "",
          priceHistory: d.priceHistory ?? [],
          productId: d.productId ?? "",
          productTitle: d.productTitle ?? "",
          createdAt: d.createdAt,
        })
      })
      const lk = docsRef.docs.at(-1)
      return { error: false, content: temp, lastKey: lk }
    } catch (err: any) {
      console.error(err)
      return {
        erorr: true,
        content: [],
        lastKey: null,
        message: typeof err === "string" ? err : "Unable to get Watchlist",
      }
    }
  },
  AddNewProduct: async (
    userId: string,
    data: { productId: string; marketplace: string }
  ) => {
    try {
      const collectionRef = collection(
        firestore,
        `watchlists/${userId}/products/`
      )
      const docRef = doc(collectionRef)
      await setDoc(
        docRef,
        {
          id: docRef.id,
          productId: data.productId ?? "",
          marketPlace: data.marketplace ?? "",
          productTitle: "",
          latestPrice: "",
          priceHistory: [],
          createdAt: Timestamp.fromDate(dayjs().toDate()),
        },
        { merge: true }
      )
      return {
        error: false,
        message: "Successfully added Product to Watchlist.",
      }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message:
          typeof err === "string" ? err : "Unable to add Product to Watchlist.",
      }
    }
  },
  DeleteProduct: async (userId: string, firebaseProductId: string) => {
    console.log("IN THE DELETE PRODUCT", userId, firebaseProductId)
    try {
      const docRef = doc(
        firestore,
        `watchlists/${userId}/products/${firebaseProductId}`
      )
      const result = await deleteDoc(docRef)
      console.log(result)
      return {
        error: false,
        message: "Successfully Deleted Product from watchlist.",
      }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message:
          typeof err === "string"
            ? err
            : "Unable to Delete Product from Watchlist.",
      }
    }
  },
}
