import { getAuth } from "firebase/auth"
import { AuthAction, withUser } from "next-firebase-auth"
import { ReactElement, useEffect } from "react"

import FullScreenLoader from "../components/FullScreenLoader"
import NoHeaderFooterLayout from "../components/layouts/NoHeaderFooterLayout"

const LogoutPage = () => {
  useEffect(() => {
    const handleLogout = async () => {
      const auth = getAuth()
      await auth.signOut()
    }

    handleLogout()
  })

  return <></>
}

LogoutPage.getLayout = function getLayout(page: ReactElement) {
  return <NoHeaderFooterLayout>{page}</NoHeaderFooterLayout>
}

export default withUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullScreenLoader,
})(LogoutPage)
