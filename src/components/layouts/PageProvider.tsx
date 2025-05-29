import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material"
import { useTheme as useNextTheme } from "next-themes"
import { ReactNode, useEffect, useState } from "react"

import { combinedTheme, darkTheme, lightTheme } from "../../styles/theme"
import createEmotionCache from "../../utils/createEmotionCache"

interface Props {
  emotionCache?: EmotionCache
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

const PageProvider = ({
  children,
  emotionCache = clientSideEmotionCache,
}: Props) => {
  const { resolvedTheme } = useNextTheme()
  const [currentTheme, setCurrentTheme] = useState(combinedTheme(lightTheme))

  useEffect(() => {
    if (resolvedTheme === "light") {
      setCurrentTheme(combinedTheme(lightTheme))
    } else {
      setCurrentTheme(combinedTheme(darkTheme))
    }
  }, [resolvedTheme])

  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  )
}

export default PageProvider
