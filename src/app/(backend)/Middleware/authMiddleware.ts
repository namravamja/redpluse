"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/app/(backend)/Config/db";

export async function verifyUser() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return { error: "Unauthorized: No token provided", status: 401 };
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      authProvider?: string; // New field to identify auth method
    };

    // Connect to database
    await connectDB();

    // Fetch user from database to ensure they still exist
    // const user = await Donor.findById(decoded.userId)

    // if (!user) {
    //   return { error: "Unauthorized: User not found", status: 404 }
    // }

    // // Check if user is verified
    // if (!user.isVerified) {
    //   return { error: "Unauthorized: Email not verified", status: 403 }
    // }

    // Return user information
    return decoded.userId;
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Unauthorized: Invalid or expired token", status: 403 };
  }
}
