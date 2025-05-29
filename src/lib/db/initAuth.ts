import "./"

import { initializeApp } from "firebase/app"
import { init } from "next-firebase-auth"

const initAuth = () => {
  const firebaseClientInitConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }
  initializeApp(firebaseClientInitConfig)
  init({
    authPageURL: "/login",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login",
    logoutAPIEndpoint: "/api/logout",
    //firebaseAuthEmulatorHost: 'localhost:9099',
    // firebase admin config
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
        clientEmail: process.env.FIREBASE_ADMIN_EMAIL ?? "",
        // private key. use process env. cannot be accessible on the client side
        privateKey: process.env.FIREBASE_ADMIN_KEY ?? "",
      },
      databaseURL: "",
    },
    // firebase client config
    // @ts-expect-error remove to see TS error
    firebaseClientInitConfig,
    cookies: {
      name: "Nextjs-portal-boilerplate", // required
      // Keys are required unless `signed` is set to `false`
      // The keys cannot be acceesible on the client side
      // use process
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days for cookie
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: false, // set this to false in local (non-HTTPS) development
      signed: true,
    },
    onVerifyTokenError: (err) => {
      console.error(err)
    },
    onTokenRefreshError: (err) => {
      console.error(err)
    },
  })
}

export default initAuth
