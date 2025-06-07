import Head from "next/head"

type Props = {
  readonly title: string
  readonly desc?: string
  readonly keywords?: string
}

export default function Seo({ title, desc, keywords }: Props) {
  return (
    <Head>
      <title>{`${title} | PORTAL`}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords} />
    </Head>
  )
}
