import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { API_BASE_URL } from "../../constant"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://laravel.test/sanctum/csrf-cookie", {
          method: "GET",
        })

        console.log(res);

        const setCookieHeader = res.headers.get("set-cookie")
        // console.log("setCookieHeader", setCookieHeader)
        // you'll find your_site_session key in this console log

        const cookies = setCookieHeader?.split(", ")
        // console.log(cookies)
        let sessionKey = null
        let xsrfToken = null

        for (const cookie of cookies!) {
          if (cookie.startsWith("laravel_session=")) {
            sessionKey = cookie.split("=")[1]
          } else if (cookie.startsWith("XSRF-TOKEN=")) {
            xsrfToken = cookie.split("=")[1]
          }

          if (sessionKey && xsrfToken) {
            break
          }
        }
        const data = {
          email: credentials?.email,
          password: credentials?.password,
        }
        const headers = new Headers({
          Cookie: `laravel_session=${sessionKey}`,
          "Content-Type": "application/json",
        })

        if (xsrfToken) {
          headers.append("X-XSRF-TOKEN", xsrfToken)
        }

        const options = {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
        try {
          // console.log(options)
          const response = await fetch(API_BASE_URL+"login", options)
          console.log(response);

          if (response.ok) {
            const res = await response.json()
            console.log("response", res)
            return res.data
          } else {
            console.log("HTTP error! Status:", response.status)
            // Handle non-successful response here, return an appropriate JSON response.
            return null
          }
        } catch (error) {
          console.log("Error", error)
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.user = user
        token.accessToken = user.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.token as string
      session.user = token.user
      // console.log(user);
      console.log(token);
      return session
    },
  },
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }