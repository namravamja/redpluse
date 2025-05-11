import { type NextRequest, NextResponse } from "next/server";
import { handleGoogleLogin } from "@/app/actions/google-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL("/?error=No code provided", request.url)
      );
    }

    const result = await handleGoogleLogin(code);

    if (result.success) {
      const response = NextResponse.redirect(
        new URL("/Donor/AuthSuccess", request.url),
        { status: 302 }
      );
      console.log("Redirecting to:", "/Donor/AuthSuccess");
      response.cookies.set("token", result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      response.cookies.set("justLoggedIn", "true", {
        maxAge: 10,
        path: "/",
      });
      return response;
    } else {
      console.log("Redirecting to:", "/");
      return NextResponse.redirect(
        new URL(`/?error=${result.error}`, request.url)
      );
    }
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=Authentication failed", request.url)
    );
  }
}
