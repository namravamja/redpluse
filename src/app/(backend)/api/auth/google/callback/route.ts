// ✅ Correct API route file
// app/api/auth/google/callback/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { handleGoogleLogin } from "@/app/actions/google-auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.redirect(new URL("/frontend/Homepage?error=No code provided", request.url))
    }

    const result = await handleGoogleLogin(code)

    if (result.success) {
      const response = NextResponse.redirect(new URL("/frontend/Donor/AuthSuccess", request.url),{status: 302,})
      console.log("Redirecting to:", "/frontend/Donor/AuthSuccess");
      response.cookies.set("token", result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      })
      response.cookies.set("justLoggedIn", "true", {
        maxAge: 10,
        path: "/",
      });
      return response
    } else {
      console.log("Redirecting to:", "/frontend/Homepage");
      return NextResponse.redirect(new URL(`/frontend/Homepage?error=${result.error}`, request.url))
    }
  } catch (error) {
    console.error("Google callback error:", error)
    return NextResponse.redirect(new URL("/frontend/Homepage?error=Authentication failed", request.url))
  }
}
