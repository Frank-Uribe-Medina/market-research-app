import * as firebaseAdmin from "firebase-admin"

if (firebaseAdmin.apps.length === 0) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: process.env.FIREBASE_ADMIN_KEY,
      clientEmail: process.env.FIREBASE_ADMIN_EMAIL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }),
  })
}

export { firebaseAdmin }
