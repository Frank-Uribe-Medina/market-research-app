import { getAuth, onAuthStateChanged } from "firebase/auth"
import { createContext, ReactNode, useEffect, useState } from "react"

import { firebase } from "../lib/db"
import { UserActions } from "../lib/db/actions/UserActions"
import { User } from "../types/user.model"
import state from "./ValtioStore"

export const AuthContext = createContext<{ user: User | null }>({
  user: null,
})

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const auth = getAuth(firebase)

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    setUser(null)
    state.user = null
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const adminInfo = await UserActions.Get(user.uid)
          if (!adminInfo.error || adminInfo.content) {
            state.user = adminInfo.content
            state.isUserLoaded = true
            setUser(adminInfo.content)
          } else {
            throw "Un authorized"
          }
        } else {
          throw "No User"
        }
      } catch {
        setUser(null)
        state.user = null
        state.isUserLoaded = true
      }
    })
  }, [auth])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}
