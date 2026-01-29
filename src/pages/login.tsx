import GoogleIcon from "@mui/icons-material/Google"
import { Box, Button, Container, Link } from "@mui/material"
import { signInWithPopup } from "firebase/auth"
import { useRouter } from "next/router"
import { AuthAction, withUser } from "next-firebase-auth"
import { ReactElement, useState } from "react"
import { toast } from "react-toastify"

import ErrorBoundary from "../components/ErrorBoundary"
import LoginForm from "../components/forms/Login"
import ResetPasswordForm from "../components/forms/ResetPassword"
import FullScreenLoader from "../components/FullScreenLoader"
import NoHeaderFooterLayout from "../components/layouts/NoHeaderFooterLayout"
import Seo from "../components/Seo"
import { auth, googleProvider } from "../lib/db"
import { UserActions } from "../lib/db/actions/UserActions"

function LoginPage() {
  const [resetPasswordMode, setResetPasswordMode] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const router = useRouter()
  const signInWithGoogle = async () => {
    try {
      const token = await signInWithPopup(auth, googleProvider)
      if (!token) {
        toast.error("Could not Sign in with google")
      }
      const result = await UserActions.Get(token.user.uid)
      if (result.error) {
        return router.push("/signup")
      }

      return router.push(`/`)
    } catch (err: any) {
      return toast.error(typeof err === "string" ? err : "Unable to sign up")
    } finally {
      setIsDisabled(false)
    }
  }
  return (
    <>
      <Seo title="LOGIN" />
      <Container>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {resetPasswordMode ? (
            <>
              <ErrorBoundary>
                <ResetPasswordForm />
              </ErrorBoundary>
              <Button
                onClick={() => setResetPasswordMode(false)}
                fullWidth
                sx={{ textTransform: "none", mt: 2 }}
              >
                Back
              </Button>
            </>
          ) : (
            <>
              <ErrorBoundary>
                <LoginForm />
                <Button
                  startIcon={<GoogleIcon />}
                  variant="contained"
                  disabled={isDisabled}
                  onClick={() => void signInWithGoogle()}
                >
                  Sign in with Google
                </Button>
              </ErrorBoundary>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => setResetPasswordMode(true)}
                  sx={{ textTransform: "none" }}
                >
                  Forgot your password?
                </Button>
                <Link href="/signup">
                  <Button sx={{ textTransform: "none" }}>
                    Don't have an account?
                  </Button>
                </Link>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <NoHeaderFooterLayout>{page}</NoHeaderFooterLayout>
}

export default withUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: FullScreenLoader,
})(LoginPage)
