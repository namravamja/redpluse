import { NextResponse } from "next/server";
import Donor from "../../../Model/EventOrganizer";
import { connectDB } from "../../../Config/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Get new password from frontend request body
    const { newPassword, token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is missing" }, { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err: unknown) {
      console.error("JWT verification error:", err); // Log the error for debugging
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const email = (decoded as { email: string }).email;

    // Find user by email
    const user = await Donor.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if token matches
    if (user.resetPasswordToken !== token) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check token expiration
    if (new Date(user.resetPasswordExpire) < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Hash new password
    user.password = newPassword;

    // Clear reset token fields
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
