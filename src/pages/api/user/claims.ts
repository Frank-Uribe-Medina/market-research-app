import type { NextApiRequest, NextApiResponse } from "next"

import { firebaseAdmin } from "../../../lib/db/admin"
import { User } from "../../../types/user.model"
import { DEFAULT_ERROR, IS_ADMIN } from "../../../utils/constants"

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    type: string
    user: string
    requestee: string
  }
}

type ResponseData = {
  error: boolean
  message: string
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method !== "POST") {
      throw "HTTP request method not allowed."
    }
    const { type, user, requestee } = req.body

    const auth = firebaseAdmin.auth()
    const firestore = firebaseAdmin.firestore()

    const adminCheck = await firestore.collection("users").doc(requestee).get()
    if (!adminCheck.exists) {
      throw "Not Authorized."
    }
    const adminData = adminCheck.data() as User
    if (adminData.type !== IS_ADMIN) {
      throw "Not Authorized."
    }
    const userCheck = await firestore.collection("users").doc(user).get()
    if (!userCheck) {
      throw "User does not exists."
    }
    const userType: Record<string, boolean> = { admin: false, user: false }
    userType[`${type}`] = true

    await auth.setCustomUserClaims(userCheck.id, userType)
    await firestore
      .collection("users")
      .doc(userCheck.id)
      .set({ type }, { merge: true })
    res.status(200).json({
      error: false,
      message: "Successfully changed user type.",
    })
  } catch (err: any) {
    console.error(err)
    res.status(400).json({
      error: true,
      message: typeof err === "string" ? err : DEFAULT_ERROR,
    })
  }
}
