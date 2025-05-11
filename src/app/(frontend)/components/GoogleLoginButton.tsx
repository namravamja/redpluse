"use client"

import { Button } from "@/components/ui/button"
import { initiateGoogleLogin } from "@/app/actions/google-auth"
import { FcGoogle } from "react-icons/fc"

export default function GoogleLoginButton() {
  return (
    <Button
      onClick={async () => {
        await initiateGoogleLogin()
      }}
      className="w-full flex items-center justify-center gap-2 mt-2"
      variant="outline"
    >
      <FcGoogle size={20} /> Sign in with Google
    </Button>
  )
}