import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, TextField, Typography } from "@mui/material"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import Image from "next/image"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"

import { BLUR_DATA_URL } from "../../utils"
import { ResetPasswordSchema } from "./schemas/ResetPasswordSchema"

type FormValues = {
  email: string
}

export default function ResetPasswordForm() {
  const [success, setSuccess] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = useDebouncedCallback(async (data: any) => {
    try {
      setIsDisabled(true)
      const target = data as FormValues
      const auth = getAuth()
      await sendPasswordResetEmail(auth, target.email, {
        url: "/login",
        handleCodeInApp: false,
      })
      setSuccess(true)
    } catch (err: any) {
      return toast.error(
        typeof err === "string" ? err : "Unable to send password reset request."
      )
    } finally {
      setIsDisabled(false)
    }
  })

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
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
        PASSWORD RESET
      </Typography>
      {success ? (
        <Typography align="center" color="primary.main">
          An email has been sent to reset your password. Please check spam
          folder if email is not in the inbox.
        </Typography>
      ) : null}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              placeholder="Email"
              error={errors.email ? true : false}
              helperText={errors.email?.message ?? ""}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={isDisabled}>
          RESET PASSWORD
        </Button>
      </Box>
    </form>
  )
}
