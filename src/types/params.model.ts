import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"

export type InfiniteParam = {
  pageParam: QueryDocumentSnapshot<DocumentData> | null
}

export type LastKey = QueryDocumentSnapshot<DocumentData> | null
