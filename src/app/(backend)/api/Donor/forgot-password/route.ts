import { NextResponse } from "next/server";
import Donor from "../../../Model/Donor";
import { connectDB } from "../../../Config/db";
import { sendResetPasswordEmail } from "../utils/emailUtils";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    // Check if user exists
    const user = await Donor.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    // Save reset token and expiry in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
    await user.save();

    console.log("🛠️ Generated Reset Token:", resetToken);

    // Send reset email
    await sendResetPasswordEmail(email, resetToken);

    return NextResponse.json({ message: "Password reset email sent." }, { status: 200 });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
