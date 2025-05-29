import { AuthAction, withUserTokenSSR } from "next-firebase-auth"

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  console.log(ctx.user?.claims)
  return {
    props: {},
  }
})

export default function Products() {}
