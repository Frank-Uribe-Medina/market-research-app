import { NextApiRequest, NextApiResponse } from "next"
import { setAuthCookies } from "next-firebase-auth"

import initAuth from "../../lib/db/initAuth"

initAuth()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await setAuthCookies(req, res)
  } catch {
    return res.status(500).json({ error: "Unexpected error." })
  }

  return res.status(200).json({ success: true })
}
