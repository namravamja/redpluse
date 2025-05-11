import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPathPatterns = [
    /^\/api\/auth(?:\/.*)?$/,
    /^\/api\/Signup\/Donor$/,
    /^\/api\/Login\/Donor$/,
    /^\/api\/Signup\/BloodBank$/,
    /^\/api\/Login\/BloodBank$/,
    /^\/api\/Signup\/EventOrganizer$/,
    /^\/api\/Login\/EventOrganizer$/,
    /^\/frontend\/Homepage$/,
    /^\/frontend\/Login\/Donor$/,
    /^\/frontend\/Signup\/Donor$/,
    /^\/frontend\/Signup\/BloodBank$/,
    /^\/frontend\/Login\/BloodBank$/,
    /^\/frontend\/Signup\/EventOrganizer$/,
    /^\/frontend\/Login\/EventOrganizer$/,
    /^\/frontend\/Verification\/Donor(\/.*)?$/,
    /^\/frontend\/Verification\/BloodBank(\/.*)?$/,
    /^\/frontend\/Verification\/EventOrganizer(\/.*)?$/,
    /^\/frontend\/Donor\/AuthSuccess$/, // ✅ Add this
    /^\/frontend\/Looking-For-Blood\/ViewBloodBank$/, // ✅ Add this
  ];

  const isPublicPath = publicPathPatterns.some((regex) => regex.test(pathname));
  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/frontend/Homepage?error=Authentication%20failed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
