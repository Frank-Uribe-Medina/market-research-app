import GoogleIcon from "@mui/icons-material/Google"
import { Box, Button, Typography } from "@mui/material"
import { signInWithPopup } from "firebase/auth"
import Image from "next/image"
import { useRouter } from "next/router"
import { AuthAction, withUser } from "next-firebase-auth"
import React, { ReactElement } from "react"
import { toast } from "react-toastify"

import ErrorBoundary from "../components/ErrorBoundary"
import RegistrationForm from "../components/forms/Registration"
import FullScreenLoader from "../components/FullScreenLoader"
import NoHeaderFooterLayout from "../components/layouts/NoHeaderFooterLayout"
import Link from "../components/Link"
import Seo from "../components/Seo"
import { auth, googleProvider } from "../lib/db"
import { UserActions } from "../lib/db/actions/UserActions"
import { BLUR_DATA_URL } from "../utils"

function SignUpPage() {
  const router = useRouter()

  const [isDisable, setIsDisabled] = React.useState(false)

  const signUpWithGoogle = async () => {
    try {
      const token = await signInWithPopup(auth, googleProvider)
      if (!token) {
        throw new Error("Cannot sign up with google")
      }
      const result = await UserActions.Create({
        firstName: token.user.displayName ?? "",
        lastName: token.user.displayName ?? "",
        phone: token.user.phoneNumber ?? "123-456-7891",
        email: token.user.email ?? "",
        password: token.providerId ?? "",
        googleAuthId: await token.user.getIdToken(),
      })
      console.log("Are we even getting here", result)
      if (result?.error) {
        throw new Error(result.message)
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
      <Typography
        align="center"
        variant="h5"
        component="h1"
        className="text-xl"
        mb={2}
      >
        Create an Account
      </Typography>

      <ErrorBoundary>
        <RegistrationForm />
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={2}
          justifyContent={"center"}
          alignItems={"center"}
          marginTop={2}
        >
          <Typography fontWeight={500}>Or</Typography>
          <Button
            disabled={isDisable}
            onClick={() => void signUpWithGoogle()}
            variant={"contained"}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
        </Box>
      </ErrorBoundary>
      <Box sx={{ mt: 2 }}>
        <Link href="/login">
          <Typography align="center">Already have an account?</Typography>
        </Link>
      </Box>
    </>
  )
}

SignUpPage.getLayout = function getLayout(page: ReactElement) {
  return <NoHeaderFooterLayout>{page}</NoHeaderFooterLayout>
}

export default withUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: FullScreenLoader,
})(SignUpPage)
