import { type NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://redpluse.vercel.app", // Your production domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400", // 24 hours cache for preflight requests
};

export function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  const { pathname } = request.nextUrl;

  // Comprehensive list of public paths that don't need authentication
  const publicPathPatterns = [
    // Auth routes
    /^\/api\/auth(?:\/.*)?$/,

    // Signup routes
    /^\/api\/Signup\/(?:Donor|BloodBank|EventOrganizer)(?:\/.*)?$/,
    /^\/Signup\/(?:Donor|BloodBank|EventOrganizer)(?:\/.*)?$/,

    // Login routes
    /^\/api\/Login\/(?:Donor|BloodBank|EventOrganizer)(?:\/.*)?$/,
    /^\/Login\/(?:Donor|BloodBank|EventOrganizer)(?:\/.*)?$/,

    // Verification routes
    /^\/Verification\/(?:Donor|BloodBank|EventOrganizer)(?:\/.*)?$/,

    // Password recovery routes
    /^\/api\/(?:Donor|BloodBank|EventOrganizer)\/(?:forgot-password|reset-password)(?:\/.*)?$/,

    // Public information routes
    /^\/api\/Looking-For-Blood\/ViewBloodBank$/,
    /^\/Looking-For-Blood\/ViewBloodBank$/,

    // Success routes
    /^\/Donor\/AuthSuccess$/,

    // Health check route
    /^\/api\/health$/,
  ];

  const isPublicPath = publicPathPatterns.some((regex) => regex.test(pathname));

  if (isPublicPath) {
    const response = NextResponse.next();
    // Apply CORS headers to all responses
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // For protected routes, check for authentication token
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/?error=Authentication%20failed", request.url)
    );
  }

  // Continue with the request if authenticated
  const response = NextResponse.next();
  // Apply CORS headers to all responses
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
