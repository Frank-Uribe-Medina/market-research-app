import type { NextApiRequest, NextApiResponse } from "next"

import { firebaseAdmin } from "../../../lib/db/admin"
import { DEFAULT_ERROR } from "../../../utils/constants"

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    user: string
    type: string
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
    const { user, type } = req.body
    const auth = firebaseAdmin.auth()
    const firestore = firebaseAdmin.firestore()
    const userCheck = await firestore.collection("users").doc(user).get()
    if (!userCheck) {
      throw "User does not exists."
    }
    const userType: Record<string, boolean> = { admin: false, user: false }
    userType[`${type}`] = true
    await auth.setCustomUserClaims(user, { admin: true })
    await firestore
      .collection("users")
      .doc(userCheck.id)
      .set({ type }, { merge: true })
    res.status(200).json({
      error: false,
      message: "Your now admin.",
    })
  } catch (err) {
    console.log(err)
    res.status(400).json({
      error: true,
      message: typeof err === "string" ? err : DEFAULT_ERROR,
    })
  }
}
