import { Analytics, getAnalytics } from "firebase/analytics"
import { getApps, initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const firebase =
  getApps().length <= 0 ? initializeApp(firebaseConfig) : getApps()[0]
let firebaseAnalytics: Analytics
if (
  firebase.name &&
  typeof globalThis !== "undefined" &&
  "window" in globalThis
) {
  firebaseAnalytics = getAnalytics(firebase)
}

const firestore = getFirestore(firebase)

export const auth = getAuth(firebase)
export const googleProvider = new GoogleAuthProvider()
export { firebase, firebaseAnalytics, firestore }
