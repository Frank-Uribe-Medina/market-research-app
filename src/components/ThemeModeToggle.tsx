import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { IconButton } from "@mui/material"
import { useTheme } from "next-themes"

export default function ThemeModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <IconButton
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      color="primary"
    >
      {resolvedTheme === "light" ? (
        <DarkModeIcon className="text-sm" />
      ) : (
        <LightModeIcon className="text-sm" />
      )}
    </IconButton>
  )
}
