import { Auth } from "firebase-admin/lib/auth/auth"
import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

import { firebaseAdmin } from "../../../lib/db/admin"

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
    googleAuthId?: string
  }
}
const STRIPE_KEY = process.env.STRIPE_SECRET

async function verifyGoogleIdToken(auth: Auth, idToken: string) {
  if (!idToken) throw new Error("Missing Google ID token")
  const decoded = await auth.verifyIdToken(idToken)

  const provider = decoded.firebase?.sign_in_provider
  if (provider !== "google.com") throw new Error("Not signed in with Google")

  return decoded // has uid, email, etc.
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Missing user credentials.")
    }
    if (!STRIPE_KEY) {
      throw new Error("Stripe secret key is not configured.")
    }
    console.log(`UserData, ${JSON.stringify(req.body)}`)

    const { email, firstName, lastName, phone, password, googleAuthId } =
      req.body
    const auth = firebaseAdmin.auth()
    const firestore = firebaseAdmin.firestore()

    let uid: string
    let finalEmail: string | undefined = email

    if (googleAuthId) {
      const decoded = await verifyGoogleIdToken(auth, googleAuthId)
      uid = decoded.uid
      finalEmail = decoded.email // trust token email over body email
    } else {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: true, message: "Email and password required." })
      }
      const userRecord = await auth.createUser({ email, password })
      uid = userRecord.uid
    }

    const stripeResult = await new Stripe(STRIPE_KEY).customers.create({
      name: `${firstName} ${lastName}`.trim() || uid,
      email: finalEmail,
      metadata: { firebase_uid: uid },
    })

    // const userResult = await auth.createUser({ email, password })
    /*
     * Set first account as superadmin and admin = true.
     * After, change claims to proper claims on user account creation
     */

    await auth.setCustomUserClaims(uid, {
      users: true,
      subplan: "free",
    })
    console.log("What is this here?", uid)

    const tags: string[] = [firstName, email, phone]
    await firestore.collection("users").doc(uid).set(
      {
        firstName: firstName,
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
    console.log("This is back in the api", err)
    res.status(400).json({
      error: true,
      message: typeof err === "string" ? err : "Unable to create an account.",
    })
  }
}
