import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import dayjs from "dayjs"
import { AuthAction, withUserTokenSSR } from "next-firebase-auth"
import { useState } from "react"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"
import { useSnapshot } from "valtio"

import Seo from "../components/Seo"
import state from "../contexts/ValtioStore"
import { UserActions } from "../lib/db/actions/UserActions"
import { formatFirebaseDate } from "../utils"

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  return {
    props: { userData: JSON.stringify(ctx.user) },
  }
})

function SettingsPage() {
  const snap = useSnapshot(state)
  const [fullName, setFullName] = useState(snap.user?.name ?? "John Smith")
  const [email, setEmail] = useState(snap.user?.email ?? "some@email.com")
  const [isDisabled, setIsDisabled] = useState(false)
  const onSubmit = useDebouncedCallback(async () => {
    try {
      setIsDisabled(true)
      const result = await UserActions.Update(snap.user?.id ?? "", {
        email: email,
        name: fullName,
      })
      if (result.error) {
        toast.error(result.message)
      }
      setIsDisabled(false)

      toast.success("Updated User Settings")
    } catch (err: any) {
      return toast.error(typeof err === "string" ? err : "Unable to sign up")
    } finally {
    }
  }, 500)

  const handleNameChange = (value: string) => {
    setFullName(value)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
  }

  if (!snap.user) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  if (!snap.user) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  if (!snap.isUserLoaded) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  return (
    <>
      <Seo title="Settings" />
      <Box sx={{ minHeight: "86vh", py: 5 }}>
        <Container sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <Typography fontWeight="bold" variant="h4">
            {" "}
            User Account Settings
          </Typography>

          <Paper
            sx={{ display: "flex", flexDirection: "column", gap: 3, p: 4 }}
          >
            <TextField
              label="Email Receiving Notifications"
              defaultValue={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleEmailChange(event.target.value)
              }}
            />
            <TextField
              label="Full Name:"
              defaultValue={fullName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleNameChange(event.target.value)
              }}
            />
            <TextField
              label="Account At"
              disabled
              defaultValue={dayjs(
                formatFirebaseDate(snap.user?.createdAt)
              ).format("MM/DD/YY")}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
            <Button
              variant="contained"
              disabled={isDisabled}
              onClick={() => void onSubmit()}
            >
              Save Settings
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default SettingsPage
