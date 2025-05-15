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
    /^\/api\/auth(?:\/.)?$/,
    /^\/api\/Donor\/verify-email$/,
    /^\/api\/Donor\/forgot-password$/,
    /^\/api\/Donor\/reset-password$/,
    /^\/api\/auth\/google\/callback$/,
    /^\/api\/Donor\/utils$/,
    /^\/api\/Donor\/profilePhoto$/,
    /^\/Config$/,
    /^\/api\/Signup\/Donor$/,
    /^\/api\/Login\/Donor$/,
    /^\/api\/BloodBank\/verify-email$/,
    /^\/api\/BloodBank\/forgot-password$/,
    /^\/api\/BloodBank\/reset-password$/,
    /^\/api\/BloodBank\/utils$/,
    /^\/api\/Signup\/BloodBank$/,
    /^\/api\/Login\/BloodBank$/,
    /^\/api\/EventOrganizer\/verify-email$/,
    /^\/api\/EventOrganizer\/forgot-password$/,
    /^\/api\/EventOrganizer\/reset-password$/,
    /^\/api\/EventOrganizer\/utils$/,
    /^\/api\/Signup\/EventOrganizer$/,
    /^\/api\/Login\/EventOrganizer$/,
    /^\/api\/BloodBank\/All$/,
    /^\/Login\/Donor$/,
    /^\/Signup\/Donor$/,
    /^\/Signup\/BloodBank$/,
    /^\/Login\/BloodBank$/,
    /^\/Signup\/EventOrganizer$/,
    /^\/Login\/EventOrganizer$/,
    /^\/Verification\/Donor(\/.)?$/,
    /^\/Verification\/BloodBank(\/.)?$/,
    /^\/Verification\/EventOrganizer(\/.)?$/,
    /^\/Donor\/AuthSuccess$/,

    /^\/Looking-For-Blood\/ViewBloodBank$/,
  ];

  // Check if the request is for a public path
  const isPublicPath = publicPathPatterns.some((regex) => {
    const match = regex.test(pathname);
    console.log(`Testing path: ${pathname}, match: ${match}`);
    return match;
  });

  if (isPublicPath) {
    const response = NextResponse.next();
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Log request details
  console.log("Request Path:", pathname);

  // Get token from cookies or headers
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");
  console.log("Token Found:", token);

  // If token is missing, redirect to login
  if (!token) {
    return NextResponse.redirect(
      new URL("/?error=Authentication%20failed", request.url)
    );
  }

  // Proceed with request
  const response = NextResponse.next();
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
export const config = {
  matcher: [
    "/api/:path*",
    "/Donor/:path*",
    "/EventOrganizer/:path*",
    "/BloodBank/:path*",
  ],
};
