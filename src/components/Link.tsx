import { Link as MuiLink } from "@mui/material"
import NextLink from "next/link"
import { ReactNode } from "react"

type Props = {
  readonly href: string | null
  readonly children: ReactNode
  readonly style?: Record<string, string | number>
  readonly sx?: Record<string, string | number>
  readonly target?: string
  readonly className?: string
  readonly "data-testid"?: string
}

export default function Link({ href, children, ...props }: Props) {
  if (!href) {
    return <>{children}</>
  }

  return (
    <NextLink
      href={href}
      passHref
      data-testid={props["data-testid"] || "link"}
      style={props.style}
      target={props.target}
    >
      <MuiLink
        {...props}
        data-testid={"link-p-text"}
        component="span"
        sx={{ textDecoration: "none" }}
      >
        {children}
      </MuiLink>
    </NextLink>
  )
}
