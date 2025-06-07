import axios from "axios"
import { Parser } from "json2csv" // to convert JSON to CSV
import type { NextApiRequest, NextApiResponse } from "next"

import { SnapShotActions } from "../../lib/db/actions/Snapshots"
import {
  BrightDataResponseShape,
  BucketsShape,
} from "../../types/snapshots.model"

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string
    listId: string
  }
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      throw "HTTP request method not allowed."
    }

    console.log("BLA BLA BLA", req.body)

    const rawSnapshots = await SnapShotActions.GetBucket(
      req.body.userId,
      req.body.listId
    )

    const snapshots: BucketsShape = rawSnapshots.content as BucketsShape
    const allData: any[] = []

    // Loop through all snapshots
    for (const snap of snapshots.snapshots) {
      console.log("Fetching snapshot: ", snap.snapshot_id)

      const response = await axios.get(
        `https://api.brightdata.com/datasets/v3/snapshot/${snap.snapshot_id}?format=json`,
        {
          headers: {
            Authorization: `Bearer ${process.env.BRIGHT_DATA_API_KEY}`,
          },
        }
      )

      const rows: BrightDataResponseShape = response.data
      console.log(`Snapshot ${snap.snapshot_id} fetched, rows: ${rows.records}`)

      allData.push(...response.data)
    }

    console.log(`Total combined rows: ${allData.length}`)

    // Convert to CSV
    const json2csvParser = new Parser()
    const csv = json2csvParser.parse(allData)

    // Set response headers to download CSV
    res.setHeader("Content-Type", "text/csv")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${snapshots.name ?? "snapshot_export"}.csv"`
    )

    // Send CSV
    res.status(200).send(csv)
  } catch (err: any) {
    console.error(err)
    res.status(400).json({
      error: true,
      message:
        typeof err === "string"
          ? err
          : "Unable to retrieve and combine snapshot data.",
    })
  }
}
