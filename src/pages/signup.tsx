import { Box, Typography } from "@mui/material"
import Image from "next/image"
import { AuthAction, withUser } from "next-firebase-auth"
import { ReactElement } from "react"

import ErrorBoundary from "../components/ErrorBoundary"
import RegistrationForm from "../components/forms/Registration"
import FullScreenLoader from "../components/FullScreenLoader"
import NoHeaderFooterLayout from "../components/layouts/NoHeaderFooterLayout"
import Link from "../components/Link"
import Seo from "../components/Seo"
import { BLUR_DATA_URL } from "../utils"

function SignUpPage() {
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
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: FullScreenLoader,
})(SignUpPage)
