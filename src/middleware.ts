import { type NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://redpluse.vercel.app", // or '*', if for dev
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  const publicPathPatterns = [
    /^\/api\/auth(?:\/.*)?$/,
    /^\/api\/Signup\/Donor$/,
    /^\/api\/Login\/Donor$/,
    /^\/api\/Signup\/BloodBank$/,
    /^\/api\/Login\/BloodBank$/,
    /^\/api\/Signup\/EventOrganizer$/,
    /^\/api\/Login\/EventOrganizer$/,
    /^\/Login\/Donor$/,
    /^\/Signup\/Donor$/,
    /^\/Signup\/BloodBank$/,
    /^\/Login\/BloodBank$/,
    /^\/Signup\/EventOrganizer$/,
    /^\/Login\/EventOrganizer$/,
    /^\/Verification\/Donor(\/.*)?$/,
    /^\/Verification\/BloodBank(\/.*)?$/,
    /^\/Verification\/EventOrganizer(\/.*)?$/,
    /^\/Donor\/AuthSuccess$/,
    /^\/Looking-For-Blood\/ViewBloodBank$/,
  ];

  const isPublicPath = publicPathPatterns.some((regex) => regex.test(pathname));

  if (isPublicPath) {
    const response = NextResponse.next();
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/?error=Authentication%20failed", request.url)
    );
  }

  const response = NextResponse.next();
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
