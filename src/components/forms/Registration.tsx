import { yupResolver } from "@hookform/resolvers/yup"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { PatternFormat } from "react-number-format"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"

import { UserActions } from "../../lib/db/actions/UserActions"
import { RegistrationSchema } from "./schemas/RegistrationSchema"

type FormValues = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
}

export default function RegistrationForm() {
  const router = useRouter()
  const [isDisabled, setIsDisabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      confirmEmail: "",
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
      const result = await UserActions.Create({
        firstName: target.firstName,
        lastName: target.lastName,
        phone: target.phone,
        email: target.email,
        password: target.password,
      })
      if (result.error) {
        throw result.message
      }
      toast.success("Successfully created an account.")
      return router.replace("/login")
    } catch (err: any) {
      return toast.error(typeof err === "string" ? err : "Unable to sign up")
    } finally {
      setIsDisabled(false)
    }
  }, 500)

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="First Name"
                error={errors.firstName ? true : false}
                helperText={errors.firstName?.message ?? ""}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Last Name"
                error={errors.lastName ? true : false}
                helperText={errors.lastName?.message ?? ""}
              />
            )}
          />
        </Box>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PatternFormat
              format="###-###-####"
              // allowEmptyFormatting
              mask="_"
              customInput={TextField}
              placeholder="Phone"
              error={errors.phone ? true : false}
              helperText={errors.phone?.message ?? ""}
              {...field}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Email"
              error={errors.email ? true : false}
              helperText={errors.email?.message ?? ""}
            />
          )}
        />
        <Controller
          name="confirmEmail"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Confirm Email"
              error={errors.confirmEmail ? true : false}
              helperText={errors.confirmEmail?.message ?? ""}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              error={errors.password ? true : false}
              helperText={errors.password?.message ?? ""}
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
      </Box>
    </form>
  )
}
