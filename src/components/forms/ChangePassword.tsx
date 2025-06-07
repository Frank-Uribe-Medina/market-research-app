"use client"
import { yupResolver } from "@hookform/resolvers/yup"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material"
import { FirebaseError } from "firebase/app"
import { getAuth, updatePassword } from "firebase/auth"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"

import { DEFAULT_ERROR } from "../../utils/constants"
import { ChangePasswordSchema } from "./schemas/ChangePasswordSchema"

interface FormValues {
  password: string
  confirmPassword: string
}

export default function ChangePasswordForm() {
  const router = useRouter()
  const [isDisabled, setIsDisabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const onSubmit = useDebouncedCallback(async (data: any) => {
    try {
      setIsDisabled(true)
      const target = data as FormValues
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw "Logged in user doesnt exist."
      }
      await updatePassword(user, target.password)
      toast.success("Successfully changed your password.")
      return router.push("/logout")
    } catch (err) {
      console.error(err)
      if (
        err instanceof FirebaseError &&
        err.code === "auth/requires-recent-login"
      ) {
        toast.error("Re Authentication is required. Please relogin first.")
      } else {
        toast.error(typeof err === "string" ? err : DEFAULT_ERROR)
      }
    } finally {
      setIsDisabled(false)
    }
  })

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Password"
              error={errors.password ? true : false}
              helperText={errors.password?.message ?? ""}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="show password"
                        onClick={handleClickShowPassword}
                        size="small"
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Confirm Password"
              fullWidth
              placeholder="Confirm Password"
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword?.message ?? ""}
            />
          )}
        />
        <Button
          type="submit"
          disabled={isDisabled}
          variant="contained"
          fullWidth
        >
          Submit
        </Button>
      </Stack>
    </form>
  )
}
