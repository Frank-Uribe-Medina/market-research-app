import axios from "axios"
import { UserCredential } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  startAfter,
} from "firebase/firestore"

import { AxiosErrorResponse } from "../../../types/axios.model"
import { LastKey } from "../../../types/params.model"
import { User } from "../../../types/user.model"
import { DEFAULT_ERROR } from "../../../utils/constants"
import { firestore } from ".."

export const UserActions = {
  Create: async (UserCred?: UserCredential) => {
    try {
      await axios.post("/api/user/create", { userCred: UserCred })
      return { error: false, message: "Successfully created an account." }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        return {
          error: true,
          message: (err.response?.data as AxiosErrorResponse).message,
        }
      }
      return {
        error: true,
        message: typeof err === "string" ? err : "Unable to create an account.",
      }
    }
  },
  Get: async (uid: string) => {
    try {
      const collectionRef = collection(firestore, "users")
      const documentRef = await getDoc(doc(collectionRef, uid))
      if (!documentRef.exists()) {
        throw "User does not exist."
      }
      const data = { id: documentRef.id, ...documentRef.data() } as User
      return { error: false, content: data }
    } catch (err: any) {
      return {
        error: true,
        content: null,
        message:
          typeof err === "string" ? err : "Unable to get user information.",
      }
    }
  },
  Update: async (userId: string, data: any) => {
    try {
      const docRef = doc(firestore, `users/${userId}`)
      await setDoc(docRef, data, { merge: true })
      return {
        error: false,
        message: "Successfully updated profile details.",
      }
    } catch (err: any) {
      return {
        error: true,
        message: typeof err === "string" ? err : DEFAULT_ERROR,
      }
    }
  },
  GetList: async (term: string, limitNum: number, lastKey: LastKey) => {
    try {
      const constraints: QueryConstraint[] = []
      constraints.push(orderBy("createdAt", "desc"), limit(limitNum))
      if (lastKey) {
        constraints.push(startAfter(lastKey))
      }
      const collectionRef = collection(firestore, "users")
      const queryRef = query(collectionRef, ...constraints)
      const docsRef = await getDocs(queryRef)
      const temp: User[] = []
      for (const doc of docsRef.docs) {
        const d = doc.data()
        temp.push({
          id: doc.id,
          ...d,
        } as User)
      }
      const lk = docsRef.docs.at(-1)
      return { error: false, content: temp, lastKey: lk }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        content: [],
        lastKey: null,
        message: typeof err === "string" ? err : "Unable to get list of users.",
      }
    }
  },
}
