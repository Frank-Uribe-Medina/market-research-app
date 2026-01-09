import { yupResolver } from "@hookform/resolvers/yup"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import Image from "next/image"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"

import { BLUR_DATA_URL } from "../../utils"
import { LoginSchema } from "./schemas/LoginSchema"

type FormValues = {
  email: string
  password: string
}

export default function LoginForm() {
  const [isDisabled, setIsDisabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = useDebouncedCallback(async (data: any) => {
    try {
      setIsDisabled(true)
      const auth = getAuth()
      const target = data as FormValues
      await signInWithEmailAndPassword(
        auth,
        target.email,
        target.password
      ).catch(() => {
        throw "Invalid credentials"
      })
    } catch (err: any) {
      return toast.error(typeof err === "string" ? err : "Failed to login.")
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
        LOGIN
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Email"
              error={errors.email ? true : false}
              helperText={errors.email?.message ?? ""}
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
                        aria-label="show passowrd"
                        onClick={handleShowPassword}
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
        <Button type="submit" variant="contained" disabled={isDisabled}>
          LOGIN
        </Button>
      </Box>
    </form>
  )
}
