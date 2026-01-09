import GoogleIcon from "@mui/icons-material/Google"
import { Box, Button, Link, Typography } from "@mui/material"
import { signInWithPopup } from "firebase/auth"
// import { getAuth, signInWithRedirect } from "firebase/auth"
import Image from "next/image"
import { AuthAction, withUser } from "next-firebase-auth"
import { ReactElement } from "react"
import { toast } from "react-toastify"

import ErrorBoundary from "../components/ErrorBoundary"
import FullScreenLoader from "../components/FullScreenLoader"
import NoHeaderFooterLayout from "../components/layouts/NoHeaderFooterLayout"
import Seo from "../components/Seo"
import { auth, googleProvider } from "../lib/db"
import { UserActions } from "../lib/db/actions/UserActions"
import { BLUR_DATA_URL } from "../utils"

function SignUpPage() {
  const siwg = async () => {
    try {
      const token = await signInWithPopup(auth, googleProvider).catch(() => {
        throw "Credentials not Valid"
      })
      const result = await UserActions.Create(token)
      if (result.error) {
        throw result.message
      }
      console.log(result.message)
    } catch (err: any) {
      toast.error("Invalid Credentials")
      console.error(err)
    }
  }

  return (
    <>
      <Seo title="Sign Up" />
      <Box sx={{ position: "relative", height: 100, mb: 4 }}>
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          fill={true}
          sizes="(max-width: 768px) 100px, (max-width: 1200px) 100px, 100px"
          style={{
            objectFit: "contain",
            width: "100%",
          }}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography variant="h5" component="h1" className="text-xl" mb={2}>
          Create an Account
        </Typography>
        <ErrorBoundary>
          {/* <RegistrationForm /> */}
          <Button
            startIcon={<GoogleIcon />}
            variant="contained"
            onClick={() => void siwg()}
          >
            Sign Up with Google
          </Button>
        </ErrorBoundary>
        <Box sx={{ mt: 2 }}>
          <Link href="/login">
            <Typography align="center">Already have an account?</Typography>
          </Link>
        </Box>
      </Box>
    </>
  )
}

SignUpPage.getLayout = function getLayout(page: ReactElement) {
  return <NoHeaderFooterLayout>{page}</NoHeaderFooterLayout>
}

export default withUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: FullScreenLoader,
})(SignUpPage)
