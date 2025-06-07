import dayjs from "dayjs"
import {
  arrayUnion,
  collection,
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

import { BucketsShape } from "../../../types/snapshots.model"
import { firestore } from ".."

export const SnapShotActions = {
  CreateSnapShotBucket: async (userId: string) => {
    const collectionRef = collection(firestore, `Snapshots/${userId}/snapshots`)
    const docRef = doc(collectionRef)
    await setDoc(
      docRef,
      {
        createdAt: Timestamp.fromDate(dayjs().toDate()),
      },
      { merge: true }
    )
    return {
      error: false,
      content: docRef.id,
      message: "Successfully Created Snapshot Bucket.",
    }
  },
  GetBucket: async (userId: string, bucketId: string) => {
    try {
      const collectionRef = collection(
        firestore,
        `Snapshots/${userId}/snapshots`
      )
      const docRef = await getDoc(doc(collectionRef, bucketId))
      const data = { id: docRef.id, ...docRef.data() } as BucketsShape
      return {
        error: false,
        content: data,
      }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message:
          typeof err === "string" ? err : "Unable To change status of Bucket",
      }
    }
  },
  AddSnapShotToBucket: async (
    userId: string,
    listName: string,
    bucketId: string,
    snapshotId: string
  ) => {
    try {
      const docRef = doc(firestore, `Snapshots/${userId}/snapshots/${bucketId}`)
      await updateDoc(docRef, {
        snapshots: arrayUnion(snapshotId),
        name: listName,
        ready: false,
      })
      return {
        error: false,
        message: "Successfully added snapshot id to Bucket.",
      }
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message:
          typeof err === "string" ? err : "Unable to Add Snapshot to Bucket.",
      }
    }
  },
  ChangeBucketStatus: async (userId: string, bucketId: string) => {
    try {
      const docRef = doc(
        firestore,
        `Snapshots/${userId}/snapshots/${bucketId}/`
      )
      await updateDoc(docRef, {
        ready: true,
      })
    } catch (err: any) {
      console.error(err)
      return {
        error: true,
        message:
          typeof err === "string" ? err : "Unable To change status of Bucket",
      }
    }
  },
  GetAllSnapShotBuckets: async (userId: string, limitNum: number) => {
    try {
      const constraints: QueryConstraint[] = []
      constraints.push(orderBy("createdAt", "desc"), limit(limitNum))
      const collectionRef = collection(
        firestore,
        `Snapshots/${userId}/snapshots/`
      )
      const queryRef = query(collectionRef, ...constraints)
      const docsRef = await getDocs(queryRef)
      const temp: any = []
      docsRef.docs.forEach((doc) => {
        const d = doc.data()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        temp.push({
          id: doc.id,
          createdAt: d.createdAt ?? "",
          snapshots: d.snapshots ?? [],
          name: d.name ?? "",
          ready: d.ready ?? "",
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
}
