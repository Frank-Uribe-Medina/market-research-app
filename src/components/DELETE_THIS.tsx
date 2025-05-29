import { Button, Typography } from "@mui/material"
import axios, { AxiosResponse } from "axios"
import { useState } from "react"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"
import { useSnapshot } from "valtio"

import state from "../contexts/ValtioStore"
import { DEFAULT_ERROR } from "../utils/constants"

export default function DELETETHIS() {
  const snap = useSnapshot(state)
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleClick = useDebouncedCallback(async () => {
    try {
      setIsLoading(true)
      if (!snap.user) {
        throw "No user logged in."
      }
      const result: AxiosResponse<{ error: boolean; message: string }> =
        await axios.post("/api/user/delete_this", {
          user: snap.user.id,
          type: "admin",
        })
      if (result.data.error) {
        throw result.data.message
      }
      toast.success(result.data.message)
      setDone(true)
    } catch (err) {
      console.log(err)
      toast.error(typeof err === "string" ? err : DEFAULT_ERROR)
    } finally {
      setIsLoading(false)
    }
  }, 500)

  return (
    <>
      {done ? (
        <Typography align="center" fontWeight="bold">
          ^^^^^ DONT FORGET ^^^^^^
          <br />
          Relog for admin status to take effect.
        </Typography>
      ) : (
        <Button
          color="error"
          onClick={() => void handleClick()}
          loading={isLoading}
        >
          MAKE ME ADMIN
        </Button>
      )}
    </>
  )
}
