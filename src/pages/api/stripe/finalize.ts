// import { getAuth } from "firebase/auth"
// import { NextApiRequest, NextApiResponse } from "next"
// import Stripe from "stripe"

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     if (req.method !== "POST") {
//       res.status(400).json({ error: true, message: "Request Failed" })
//     }

//     // Test this once its live as I would need the actual URL for stripe to send this to the right webhook
//     const signature = req.headers
//     const decoded = await getAuth().currentUser?.getIdToken()
//   } catch (err: any) {
//     res.status(400).json({ error: true, message: err })
//   }
// }
