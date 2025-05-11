import { NextResponse } from "next/server";
import Donor from "../../../Model/Donor";
import { connectDB } from "../../../Config/db";
import { sendVerificationEmail } from "../../Donor/utils/emailUtils";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { fullName, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await Donor.findOne({ email });

    if (existingUser) {
      // If user exists but isn't verified, delete them before re-registering
      if (!existingUser.isVerified) {
        await Donor.deleteOne({ email });
      } else {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
    }

    // Generate verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Create new user

    await Donor.create({
      fullName,
      email,
      password,
      verificationToken,
      isVerified: false, // User needs to verify before logging in
    });

    console.log("🛠️ Generated Token:", verificationToken);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Schedule deletion if user isn't verified after 1 hour
    setTimeout(async () => {
      const user = await Donor.findOne({ email });
      if (user && !user.isVerified) {
        await Donor.deleteOne({ email });
        console.log(`🚨 Deleted unverified user: ${email}`);
      }
    }, 60 * 60 * 1000); // 1 hour

    return NextResponse.json(
      { message: "User registered. Check email for verification." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
