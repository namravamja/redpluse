import { NextResponse } from "next/server";
import User from "../../Model/BloodBank";
import { connectDB } from "../../Config/db";
import { verifyUser } from "../../Middleware/authMiddleware";

connectDB();

export async function GET() {
  // ✅ Apply auth middleware (it will block unauthorized requests)
  const response = verifyUser();

  try {
    // ✅ Extract email from request headers (set by middleware)
    const userId = await response;

    // ❌ If email is missing, return an error
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fetch user from MongoDB by email (excluding password)
    const user = await User.findById(userId).select("-password");

    console.log("user", user);

    // ❌ If user doesn't exist, return error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Return user details (excluding password)
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
