import { NextResponse } from "next/server";

export async function POST() {
  const response = new NextResponse(JSON.stringify({ message: "Logout successful" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
