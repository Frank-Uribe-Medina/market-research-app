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
  Timestamp,
  updateDoc,
} from "firebase/firestore"

import {
  KeyWordObjectModal,
  KeyWordShape,
} from "../../../types/keyWordList.model"
import { firestore } from ".."

export const KeyWordActions = {
  CreateKeyWordList: async (userId: string, keyWordListName: string) => {
    // Issue found here is that I need to make sure that the user is loaded on the page level so that
    // There is a definite user ID here
    const collectionRef = collection(firestore, `userlists/${userId}/lists`)
    const docRef = doc(collectionRef)

    await setDoc(
      docRef,

      {
        name: keyWordListName,
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
  GetAllKeyWordLists: async (userId: string, limitNum: number) => {
    try {
      const constraints: QueryConstraint[] = []
      constraints.push(orderBy("createdAt", "desc"), limit(limitNum))

      const collectionRef = collection(firestore, `userlists/${userId}/lists/`)
      const queryRef = query(collectionRef, ...constraints)
      const docsRef = await getDocs(queryRef)

      const temp: KeyWordObjectModal[] = []
      docsRef.docs.forEach((doc) => {
        const d = doc.data()
        temp.push({
          id: doc.id,
          keyWords: d.keyWords,
          createdAt: d.createdAt,
          ready: d.cready,
          name: d.name,
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
        message:
          typeof err === "string" ? err : "Unable to get KeyWord Lists Data.",
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
  GetList: async (userId: string, listId: string) => {
    // /userlists/${userID}/lists/${listID}
    // FireBase Path
    try {
      const docRef = doc(firestore, "userlists", userId, "lists", listId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        throw "Document Does not exits"
      }

      const content = docSnap?.data()

      const data: KeyWordObjectModal = {
        id: docRef.id,
        name: content.name ?? "",
        keyWords: content.keyWords ?? "",
        createdAt: content.createdAt ?? "",
        ready: content.ready ?? "",
        ...content,
      }
      return {
        error: false,
        message: "Successfully Grabed Key Word List",
        content: data,
      }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message:
          typeof err === "string" ? err : "Unable to Get List of KeyWords.",
      }
    }
  },
  DeleteKeyWord: async (
    userId: string,
    listId: string,
    keywordToDelete: string
  ) => {
    // /userlists/${userID}/lists/${listID}

    try {
      console.log("In catch statement")
      const docRef = doc(firestore, `userlists/${userId}/lists/${listId}`)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        throw "List Does not Exist."
      }
      // I need to filter out the keyword that matches
      const KeyWordData = docSnap.data()
      const data: KeyWordObjectModal = {
        id: docRef.id,
        keyWords: KeyWordData.keyWords,
        ready: KeyWordData.ready,
        name: KeyWordData.name,
        createdAt: KeyWordData.createdAt,
      }
      console.log(data)
      const filterKeyWords = data.keyWords.filter(
        (item: KeyWordShape) => item.keyword !== keywordToDelete
      )
      console.log(filterKeyWords)
      await updateDoc(docRef, {
        keyWords: filterKeyWords,
      })
      return {
        error: false,
        message: "Successfully Deleted KeyWord.",
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
  DeleteList: async (userId: string, listId: string) => {
    try {
      const docsRef = doc(firestore, `userlists/${userId}/lists/${listId}`)
      await deleteDoc(docsRef)
      return {
        error: false,
        message: "Successfully Deleted List.",
      }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message: typeof err === "string" ? err : "Unable to delete list.",
      }
    }
  },
}
