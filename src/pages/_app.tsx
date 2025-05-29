import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import "../styles/globals.css"
import "react-toastify/dist/ReactToastify.css"

import { EmotionCache } from "@emotion/react"
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { AppProps } from "next/app"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import NextNProgress from "nextjs-progressbar"
import { ComponentType, ReactNode, useState } from "react"
import { toast, ToastContainer } from "react-toastify"

import DefaultLayout from "../components/layouts/DefaultLayout"
import PageProvider from "../components/layouts/PageProvider"
import { AuthProvider } from "../contexts/AuthProvider"
import initAuth from "../lib/db/initAuth"

interface Props extends AppProps {
  readonly Component: ComponentType & {
    getLayout?: (page: ReactNode) => ReactNode
  }
  readonly emotionCache?: EmotionCache
}

initAuth()

function MyApp({ Component, pageProps, emotionCache }: Props) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
      queryCache: new QueryCache({
        onError: (err, query) => {
          // only show error toast if we already have data in the cache
          // which indicates a failed background update
          if (query.state.data !== undefined) {
            // @ts-expect-error remove to see TS error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (err.response && err.response.data?.message) {
              // @ts-expect-error remove to see TS error
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              toast.error(err.response.data.message)
            } else {
              toast.error("Something went wrong.")
            }
          }
        },
      }),
    })
  )

  const getLayout =
    Component.getLayout ||
    ((page: ReactNode) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemeProvider>
        <ToastContainer position="top-right" />
        <NextNProgress color="#ff0045" />
        <PageProvider emotionCache={emotionCache}>
          <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
        </PageProvider>
      </NextThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
