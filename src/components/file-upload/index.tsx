import FileUploadIcon from "@mui/icons-material/FileUpload"
import {
  Box,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { ChangeEvent, useState } from "react"
import { toast } from "react-toastify"

import { randomStr } from "../../utils"

type Props = {
  readonly defaultSrc?: string
  readonly folder: string
  readonly uploaded: (s: string) => void
  readonly maxWidth?: string
}

export default function FileUpload({
  defaultSrc = "",
  folder,
  uploaded,
  maxWidth = "300px",
}: Props) {
  const [progress, setProgress] = useState(0)

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      if (!/(^image)(\/)\w*/gm.test(files[0].type)) {
        toast.error("Please upload an image.")
      } else {
        setProgress(0)
        const file = files[0]
        const storage = getStorage()
        const storageRef = ref(storage, `/${folder}/${randomStr()}.png`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setProgress(percent)
          },
          () => toast.error("Error uploading image."),
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((url) => {
                uploaded(url)
                setProgress(0)
              })
              .catch(() => {
                toast.error("Error getting uploaded url.")
              })
          }
        )
      }
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: maxWidth,
        height: "300px",
        position: "relative",
        background: "#dadada",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {defaultSrc ? (
        <CardMedia
          component="img"
          height="300"
          image={defaultSrc}
          alt="Upload Product Image"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
            zIndex: 2,
          }}
        />
      ) : null}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          zIndex: 3,
        }}
      >
        {progress ? (
          <>
            <CircularProgress value={progress} variant="determinate" />
          </>
        ) : (
          <>
            <IconButton size="small" component="label" color="secondary">
              <input
                name="image"
                type="file"
                accept="image/*"
                hidden
                onChange={handleChangeFile}
              />
              <FileUploadIcon />
            </IconButton>
            <Typography>Main Image</Typography>
          </>
        )}
      </Box>
    </Box>
  )
}
