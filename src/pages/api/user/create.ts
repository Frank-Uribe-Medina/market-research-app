import type { NextApiRequest, NextApiResponse } from "next"

import { firebaseAdmin } from "../../../lib/db/admin"
import { numbersOnly } from "../../../utils"

type Data = {
  error: boolean
  message: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
  }
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method !== "POST") {
      throw "HTTP request method not allowed."
    }
    const { email, firstName, lastName, phone, password } = req.body
    const tags = [
      email.toUpperCase(),
      firstName.toUpperCase(),
      lastName.toUpperCase(),
      numbersOnly(phone),
    ]
    const auth = firebaseAdmin.auth()
    const firestore = firebaseAdmin.firestore()
    const userResult = await auth.createUser({ email, password })
    /*
     * Set first account as superadmin and admin = true.
     * After, change claims to proper claims on user account creation
     */
    await auth.setCustomUserClaims(userResult.uid, {
      users: true,
    })
    await firestore.collection("users").doc(userResult.uid).set(
      {
        firstName,
        lastName,
        email,
        phone: phone,
        tags,
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )
    res.status(200).json({ error: false, message: "Created a new account." })
  } catch (err: any) {
    console.log(err)
    res.status(400).json({
      error: true,
      message: typeof err === "string" ? err : "Unable to create an account.",
    })
  }
}
