import jwt from "jsonwebtoken";
import Donor from "../../../Model/BloodBank";
import { connectDB } from "../../../Config/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
   
    const {token} = await req.json();

    console.log("🔍 Received Token:", token);
    console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);

    if (!token) {
      return NextResponse.json({ error: "Token is missing" }, { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("✅ Decoded Token:", decoded);
    } catch (error) {
      console.error("❌ JWT Verification Error:", error);

      // Find and delete unverified user
      const unverifiedUser = await Donor.findOne({ verificationToken: token, isVerified: false });

      if (unverifiedUser) {
        console.log("🗑️ Deleting Unverified User:", unverifiedUser.email);
        await Donor.deleteOne({ _id: unverifiedUser._id });
      }

      return NextResponse.json({ error: "Invalid or expired token. User deleted." }, { status: 400 });
    }

    const email = (decoded as { email: string }).email;

    console.log("📩 Verifying email:", email);
    const user = await Donor.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
