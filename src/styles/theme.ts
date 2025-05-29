/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createTheme } from "@mui/material"

export const darkMode = {
  primary: {
    main: "#afe507",
  },
  secondary: {
    main: "#ff0045",
    light: "#ff0045",
    dark: "#ff0045",
  },
  offset: {
    main: "#e5e5e5",
    light: "rgba(0,0,0,0.75)",
    dark: "#e5e5e5",
  },
  error: {
    main: "#ff0045",
  },
  success: {
    main: "#b4ff02",
  },
  background: {
    default: "#0e0e0e",
  },
  text: {
    primary: "#fff",
    secondary: "#000",
  },
}
const lightMode = {
  primary: {
    main: "#212121", // highlight
  },
  secondary: {
    main: "#afe507",
    light: "#7A4988",
    dark: "#710193",
  },
  offset: {
    main: "#E1E1E1", // border
    light: "#F6F6F6", // alt BG
    dark: "#E1E1E1", // missing
  },
  error: {
    main: "#DF5060",
  },
  success: {
    main: "#0EB461",
  },
  background: {
    default: "#ffff", // main bg
  },
  text: {
    primary: "#0e0e0e", // main text
    secondary: "#212121", // sub text
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
