import axios from "axios"
import type { NextApiRequest, NextApiResponse } from "next"

import { SnapShotActions } from "../../lib/db/actions/Snapshots"
import {
  BrightDataResponseShape,
  BucketsShape,
} from "../../types/snapshots.model"

type Data = {
  error: boolean
  message: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string
    listIds: BucketsShape[]
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method !== "POST") {
      throw "HTPP request method not allowed."
    }

    const notReadySnapshotIds: BucketsShape[] = []

    req.body.listIds.forEach((lists) => {
      if (!lists.ready) {
        notReadySnapshotIds.push(lists)
      }
    })
    if (notReadySnapshotIds.length <= 0) {
      console.log("all lists are ready for download")
      res.status(200).json({ error: false, message: "All Lists ready." })
    }
    console.log("Not ReadySnapshots", notReadySnapshotIds)
    for (const snapshot of notReadySnapshotIds) {
      let allSnapshotsReady = true // assume all ready until we find one not ready

      for (const snap of snapshot.snapshots) {
        try {
          const bright_data_response = await axios.get(
            `https://api.brightdata.com/datasets/v3/progress/${snap.snapshot_id}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.BRIGHT_DATA_API_KEY}`,
              },
            }
          )
          const response: BrightDataResponseShape = bright_data_response.data
          if (response.status !== "ready") {
            allSnapshotsReady = false
          }
          console.log(
            `Snapshot ${response.snapshot_id} status: ${response.status}`
          )
        } catch (error) {
          console.error(`Error checking snapshot ${snap}`, error)
          allSnapshotsReady = false
        }
        // After checking ALL snapshots in this bucket:
      }
      if (allSnapshotsReady) {
        await SnapShotActions.ChangeBucketStatus(req.body.userId, snapshot.id)
        console.log(`Bucket ${snapshot.id} marked as ready in Firestore.`)
      } else {
        console.log(`Bucket ${snapshot.id} still has snapshots not ready.`)
      }
    }

    // const result = KeyWordActions.GetList(req.body.userId, req.body.listId)
    // console.log("In the API", (await result).content?.ready)

    res.status(200).json({ error: false, message: "Running List Search." })
  } catch (err: any) {
    console.error(err)
    res.status(400).json({
      error: true,
      message:
        typeof err === "string" ? err : "Unable to retreive list statuses.",
    })
  }
}
