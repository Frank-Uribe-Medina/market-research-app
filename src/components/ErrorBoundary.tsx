import RefreshIcon from "@mui/icons-material/Refresh"
import { Box, IconButton, Tooltip, Typography } from "@mui/material"
import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  iconOnly?: boolean
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    // Update state to show fallback UI.
    return { hasError: true }
  }

  // eslint-disable-next-line sonarjs/function-return-type
  public render() {
    if (this.state.hasError) {
      if (this.props.iconOnly) {
        return (
          <IconButton
            onClick={() => globalThis.location.reload()}
            data-testid="errorBoundaryButton"
          >
            <Tooltip title="Refresh Page">
              <RefreshIcon
                sx={{ color: "red" }}
                data-testid="errorBoundaryIcon"
              />
            </Tooltip>
          </IconButton>
        )
      }

      return (
        <Box
          data-testid="errorBoundaryMessage"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: "#fff",
            p: 2,
            borderRadius: "10px",
          }}
        >
          <Typography color="text.primary">Failed to load.</Typography>
          <IconButton
            onClick={() => globalThis.location.reload()}
            data-testid="errorBoundaryButton"
          >
            <Tooltip title="Refresh Page">
              <RefreshIcon
                sx={{ color: "red" }}
                data-testid="errorBoundaryIcon"
              />
            </Tooltip>
          </IconButton>
        </Box>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
