import createEmotionServer from "@emotion/server/create-instance"
import Document, { Head, Html, Main, NextScript } from "next/document"

import createEmotionCache from "../utils/createEmotionCache"

export default class MainDocument extends Document<{ emotionStyleTags: any }> {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="robots" content="noindex,nofollow" key="robots" />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MainDocument.getInitialProps = async (ctx) => {
  const view = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    view({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags,
  }
}
