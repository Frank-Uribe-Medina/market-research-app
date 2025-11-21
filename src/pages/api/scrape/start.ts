import { firestore } from "firebase-admin"
import type { NextApiRequest, NextApiResponse } from "next"

import { firebaseAdmin } from "../../../lib/db/admin"
import { QueueShape } from "../../../types/keyWordList.model"

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
    console.log(req.body)
    const adminDb = firebaseAdmin.app().firestore()
    const userId = req.body.userId

    const snapshot = await adminDb
      .collection(`user_keywords/${userId}/keywords`)
      .get()
    const data: QueueShape[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          userId: doc.data().userId ?? "",
          keyword: doc.data().keyword ?? "",
          marketplaces: doc.data().marketplaces,
          limitInput: doc.data().limitInput,
        }) as QueueShape
    )
    const scrapeQueueDocRef = adminDb.collection("scrape_queue").doc()
    const jobId = scrapeQueueDocRef.id
    await scrapeQueueDocRef.set({
      id: jobId,
      userId: userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      claimed: false,
      keywords: data,
    })

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
