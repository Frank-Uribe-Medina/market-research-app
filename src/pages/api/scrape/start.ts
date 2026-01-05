import axios from "axios"
import { firestore } from "firebase-admin"
import type { NextApiRequest, NextApiResponse } from "next"

import { firebaseAdmin } from "../../../lib/db/admin"
import { QueueShape, UserAddedSku } from "../../../types/keyWordList.model"

type Data = {
  error: boolean
  message: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string
  }
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({ error: true, message: "Not Allowed" })
    }
    if (!req.body.userId) {
      return res.status(400).json({ error: true, message: "Not Authed" })
    }
    const BACKENDURL =
      process.env.NODE_ENV === "production"
        ? `${process.env.BACKENDURL}/api/process/manual`
        : "http://localhost:5000/api/process/manual"

    console.log(req.body)
    console.log("Whats thos ", BACKENDURL)
    const adminDb = firebaseAdmin.app().firestore()
    const userId = req.body.userId

    const snapshot = await adminDb.collection(`user_skus/${userId}/skus`).get()

    const data: UserAddedSku[] = snapshot.docs.map((doc) => {
      return doc.data() as UserAddedSku
    })

    const scrapeQueueDocRef = adminDb.collection("scrape_queue").doc()
    const jobId = scrapeQueueDocRef.id
    await scrapeQueueDocRef.set({
      id: jobId,
      userId: userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      claimed: false,
      skus: data,
    } as QueueShape)

    console.log("What is this docs ID thats being sent to the backedn", jobId)
    const scrapeWorkerResponse = await axios.post(BACKENDURL, {
      docId: jobId,
    })
    if (scrapeWorkerResponse.status !== 200) {
      return res
        .status(201)
        .json({ error: true, message: "please try again in a bit" })
    }

    return res
      .status(200)
      .json({ error: false, message: "Successfully Added Job to Queue" })
  } catch (err: any) {
    console.error(err)
    res.status(400).json({
      error: true,
      message: typeof err === "string" ? err : "Unable to create an account.",
    })
  }
}
