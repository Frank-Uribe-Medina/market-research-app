import { doc, setDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

import { firestore } from "../../../lib/db"

type Data = {
  error: boolean
  message: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string
    email: string
    firstName: string
    lastName: string
  }
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Not Authed")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method !== "POST") {
      throw "HTTP request method not allowed."
    }
    const { email, firstName, lastName, userId } = req.body

    const customer = await stripe.customers.create({
      name: `${firstName} ${lastName !== firstName ? lastName : ""}`,
      email: email,
    })
    const customerUid = customer.id
    const docRef = doc(firestore, `users/${userId}`)
    await setDoc(docRef, { customerId: customerUid }, { merge: true })

    res
      .status(200)
      .json({ error: false, message: "Created Stripe user a new account." })
  } catch (err: any) {
    res.status(400).json({
      error: true,
      message: typeof err === "string" ? err : "Unable to create an account.",
    })
  }
}
