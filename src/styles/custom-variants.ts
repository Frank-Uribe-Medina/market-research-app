declare module "@mui/material/styles" {
  interface Palette {
    offset: Palette["primary"]
  }

  interface PaletteOptions {
    offset?: PaletteOptions["primary"]
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    slim: true
    slimActive: true
  }
}

export {}
