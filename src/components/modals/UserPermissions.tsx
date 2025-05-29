import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Modal,
  Typography,
} from "@mui/material"
import axios, { AxiosResponse } from "axios"
import { ChangeEvent, useState } from "react"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"
import { useSnapshot } from "valtio"

import state from "../../contexts/ValtioStore"
import { User } from "../../types/user.model"
import { DEFAULT_ERROR, IS_ADMIN, IS_USER } from "../../utils/constants"

type Props = {
  readonly user: User
}

export default function UserPermissionsModal({ user }: Props) {
  const snap = useSnapshot(state)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [claims, setClaims] = useState({
    admin: user.type === IS_ADMIN ? true : false,
    user: user.type === IS_USER ? true : false,
  })
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setClaims({
      admin: false,
      user: false,
      [event.target.name]: event.target.checked,
    })
  }

  const handleConfirm = useDebouncedCallback(async () => {
    try {
      setIsLoading(true)
      if (!snap.user) {
        throw "Please relogin"
      }
      let userType = IS_USER
      if (claims.admin) {
        userType = IS_ADMIN
      }
      const result: AxiosResponse<{ error: boolean; message: string }> =
        await axios.post("/api/user/claims", {
          type: userType,
          user: user.id,
          requestee: snap.user?.id,
        })
      if (result.data.error) {
        throw result.data.message
      }
      toast.success(result.data.message)
      handleClose()
    } catch (err) {
      toast.error(typeof err === "string" ? err : DEFAULT_ERROR)
    } finally {
      setIsLoading(false)
    }
  }, 500)

  return (
    <>
      <EditIcon onClick={handleOpen} />
      <Modal open={isOpen} onClose={handleClose}>
        <Box
          sx={{
            bgcolor: "background.default",
            p: 4,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 300,
            width: "100%",
            borderRadius: "10px",
          }}
        >
          <Typography>Select Role</Typography>
          <Box>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={claims.admin}
                      onChange={handleChange}
                      name="admin"
                    />
                  }
                  label="Admin"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={claims.user}
                      onChange={handleChange}
                      name="user"
                    />
                  }
                  label="User"
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          >
            <Button>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => void handleConfirm()}
              loading={isLoading}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
