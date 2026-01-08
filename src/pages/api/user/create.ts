import { UserCredential } from "firebase/auth"
import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

import { firebaseAdmin } from "../../../lib/db/admin"

type Data = {
  error: boolean
  message: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userCred: UserCredential
  }
}
const STRIPE_KEY = process.env.STRIPE_SECRET

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Missing user credentials.")
    }
    if (!req.body?.userCred) {
      throw new Error("Missing user credentials.")
    }
    if (!STRIPE_KEY) {
      throw new Error("Stripe secret key is not configured.")
    }

    const stripeResult = await new Stripe(STRIPE_KEY).customers.create({
      name: req.body.userCred.user.displayName ?? "Name Not Found",
      email: req.body.userCred.user.email ?? "missing-email@example.com",
    })

    const auth = firebaseAdmin.auth()
    const firestore = firebaseAdmin.firestore()
    // const userResult = await auth.createUser({ email, password })
    /*
     * Set first account as superadmin and admin = true.
     * After, change claims to proper claims on user account creation
     */
    const userData = req.body.userCred
    await auth.setCustomUserClaims(userData.user.uid, {
      users: true,
      subplan: "free",
    })

    const name = userData.user.displayName ?? "No Name"
    const email = userData.user.email ?? ""
    const phone = userData.user.phoneNumber ?? "000-000-0000"
    const tags: string[] = [name, email, phone]

    await firestore.collection("users").doc(userData.user.uid).set(
      {
        name,

        customer_id: stripeResult.id,
        email,
        phone: phone,
        tags,
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )
    res.status(200).json({ error: false, message: "Created a new account." })
  } catch (err: any) {
    res.status(400).json({
      error: true,
      message: typeof err === "string" ? err : "Unable to create an account.",
    })
  }
}
