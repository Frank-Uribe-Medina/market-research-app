/*
 * DB: user/{auth_uid}
 */

import { Timestamp } from "firebase/firestore"

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  customer_id: string
  phone: string
  tags: string[]
  createdAt: Timestamp
  type: string
  subplan: "free" | "pro" | "business"
}
