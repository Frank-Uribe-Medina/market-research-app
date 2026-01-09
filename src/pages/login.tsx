import GoogleIcon from "@mui/icons-material/Google"
import { Box, Button, Container, Link } from "@mui/material"
import { signInWithPopup } from "firebase/auth"
import { AuthAction, withUser } from "next-firebase-auth"
import { ReactElement, useState } from "react"

import ErrorBoundary from "../components/ErrorBoundary"
import LoginForm from "../components/forms/Login"
import ResetPasswordForm from "../components/forms/ResetPassword"
import FullScreenLoader from "../components/FullScreenLoader"
import NoHeaderFooterLayout from "../components/layouts/NoHeaderFooterLayout"
import Seo from "../components/Seo"
import { auth, googleProvider } from "../lib/db"

function LoginPage() {
  const [resetPasswordMode, setResetPasswordMode] = useState(false)
  const siwg = async () => {
    try {
      console.log("Clicked")
      await signInWithPopup(auth, googleProvider).catch(() => {
        throw "Invalid credentials"
      })
    } catch (err: any) {
      console.log("This is the error", err)
      console.error(err)
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
                  onClick={() => void siwg()}
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
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: FullScreenLoader,
})(LoginPage)
