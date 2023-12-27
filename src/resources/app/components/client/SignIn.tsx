"use client"

import { useSession, signIn, signOut } from "next-auth/react"
export default function SignIn() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <button className="btn btn-error text-white" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="btn btn-info text-white" onClick={() => signIn()}>Sign in</button>
    </>
  )
}