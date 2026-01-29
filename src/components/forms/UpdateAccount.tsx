import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Stack, TextField } from "@mui/material"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { PatternFormat } from "react-number-format"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"

import { UserActions } from "../../lib/db/actions/UserActions"
import { User } from "../../types/user.model"
import { UpdateAccountSchema } from "./schemas/UpdateAccountSchema"

type FormValues = {
  name: string
  phone: string
}

interface Props {
  readonly user: User
}

export default function UpdateAccount({ user }: Props) {
  const [isDisabled, setIsDisabled] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UpdateAccountSchema),
    defaultValues: {
      name: user.firstName,
      phone: user.phone,
    },
  })

  const onSubmit = useDebouncedCallback(async (data: any) => {
    try {
      setIsDisabled(true)
      const target = data as FormValues
      const result = await UserActions.Update(user.id, {
        firstName: target.name,
        phone: target.phone,
      })
      if (result.error) {
        throw result.message
      }
      return toast.success(result.message)
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to update profile.")
    } finally {
      setIsDisabled(false)
    }
  }, 500)

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="First Name"
                placeholder="First Name"
                error={errors.name ? true : false}
                helperText={errors.name?.message ?? ""}
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
              fullWidth
            />
          )}
        />
        <Button type="submit" loading={isDisabled} variant="contained">
          Update Profile
        </Button>
      </Stack>
    </form>
  )
}
