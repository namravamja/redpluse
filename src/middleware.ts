import { type NextRequest, NextResponse } from "next/server";

/**
 * CORS headers configuration
 * This allows requests from your production domain
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://redpluse.vercel.app", // Your production domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With, Accept",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400", // 24 hours cache for preflight requests
};

/**
 * Apply CORS headers to any response
 */
function applyCorsHeaders(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function middleware(request: NextRequest) {
  // Handle preflight OPTIONS requests for all paths
  if (request.method === "OPTIONS") {
    return applyCorsHeaders(new NextResponse(null, { status: 204 }));
  }

  const { pathname } = request.nextUrl;

  // List of paths that should be publicly accessible without authentication
  const publicPathPrefixes = [
    // Authentication flows
    "/api/auth",
    "/auth",

    // Signup paths
    "/api/Signup",
    "/Signup",

    // Login paths
    "/api/Login",
    "/Login",

    // Verification paths
    "/api/Verification",
    "/Verification",

    // Password reset flows
    "/api/forgot-password",
    "/api/reset-password",
    "/forgot-password",
    "/reset-password",

    // Specific public endpoints
    "/api/Looking-For-Blood",
    "/Looking-For-Blood",
    "/api/Donor/AuthSuccess",
    "/Donor/AuthSuccess",

    // Email verification endpoints
    "/api/verify-email",
    "/verify-email",

    // Health check
    "/api/health",
  ];

  // Check if current path is public
  const isPublicPath = publicPathPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Allow public paths without authentication
  if (isPublicPath) {
    return applyCorsHeaders(NextResponse.next());
  }

  // For protected routes, verify authentication
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/?error=Authentication%20failed", request.url)
    );
  }

  // Allow authenticated requests to proceed
  return applyCorsHeaders(NextResponse.next());
}

/**
 * This config specifies which routes this middleware applies to
 * Using a broad matcher to catch all API routes
 */
export const config = {
  matcher: ["/api/:path*"],
};
