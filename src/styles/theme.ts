/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createTheme } from "@mui/material"

export const darkMode = {
  primary: {
    main: "#90CAF9",
  },
  secondary: {
    main: "#26A69A",
    light: "#26A69A",
    dark: "#26A69A",
  },
  offset: {
    main: "#37474F",
    light: "#37474F",
    dark: "#37474F",
  },
  error: {
    main: "#EF5350",
  },
  success: {
    main: "#81C784",
  },
  background: {
    default: "#121212",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B0BEC5",
  },
}
const lightMode = {
  primary: {
    main: "#1976D2", // highlight
  },
  secondary: {
    main: "#009688",
    light: "#009688",
    dark: "#009688",
  },
  offset: {
    main: "#F5F5F5", // border
    light: "#F5F5F5", // alt BG
    dark: "#F5F5F5", // missing
  },
  error: {
    main: "#E53935",
  },
  success: {
    main: "#4CAF50",
  },
  background: {
    default: "#FFFFFF", // main bg
  },
  text: {
    primary: "#0E0E0E", // main text
    secondary: "#37474F", // sub text
  },
}

export const darkTheme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial",
  },
  palette: {
    mode: "dark",
    primary: {
      main: darkMode.primary.main,
    },
    secondary: {
      main: darkMode.secondary.main,
      light: darkMode.secondary.light,
      dark: darkMode.secondary.dark,
    },
    offset: {
      main: darkMode.offset.main,
      light: darkMode.offset.light,
      dark: darkMode.offset.dark,
    },
    error: {
      main: darkMode.error.main,
    },
    success: {
      main: darkMode.success.main,
    },
    background: {
      default: darkMode.background.default,
    },
    text: {
      primary: darkMode.text.primary,
      secondary: darkMode.text.secondary,
    },
  },
})

export const lightTheme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial",
  },
  palette: {
    mode: "light",
    primary: {
      main: lightMode.primary.main,
    },
    secondary: {
      main: lightMode.secondary.main,
      light: lightMode.secondary.light,
      dark: lightMode.secondary.dark,
    },
    offset: {
      main: lightMode.offset.main,
      light: lightMode.offset.light,
      dark: lightMode.offset.dark,
    },
    error: {
      main: lightMode.error.main,
    },
    success: {
      main: lightMode.success.main,
    },
    background: {
      default: lightMode.background.default,
    },
    text: {
      primary: lightMode.text.primary,
      secondary: lightMode.text.secondary,
    },
  },
})

export const combinedTheme = (theme: any) => {
  return createTheme(theme, {
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root": {
              color: theme.palette.text.primary,
            },
          },
        },
      },
    },
  })
}

/* eslint-enable @typescript-eslint/no-unsafe-member-access */
