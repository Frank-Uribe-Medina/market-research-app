import type { NextApiRequest, NextApiResponse } from "next"

import { DEFAULT_ERROR } from "../../../utils/constants"

type ResponseData = {
  error: boolean
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | string>
) {
  try {
    if (req.method !== "GET") {
      throw "HTTP request method not allowed."
    }
    if (!req.query["hub.challenge"]) {
      return res.status(403)
    }
    return res.status(200).send(req.query["hub.challenge"] as string)
  } catch (err: any) {
    console.error(err)
    res.status(400).json({
      error: true,
      message: typeof err === "string" ? err : DEFAULT_ERROR,
    })
  }
}
